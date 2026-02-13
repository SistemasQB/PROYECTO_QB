/* ═══════════════════════════════════════════════
   Dashboard App – Vanilla JS
   ═══════════════════════════════════════════════ */
  //  (function () {
  "use strict";

  /* ── State ─────────────────────────────────── */
  let allData = [...servicios];
  let filters = { supervisor: "", region: "", semana: "", mes: "" };
  let tableVisible = false;
  let expandedRows = new Set();
  let charts = {};

  /* ── DOM refs ──────────────────────────────── */
  const $ = (id) => document.getElementById(id);
  const fechaInicio = $("fechaInicio");
  const fechaFin = $("fechaFin");
  const btnQuery = $("btnQuery");
  const queryError = $("queryError");
  const queryInfo = $("queryInfo");
  const loadingOverlay = $("loadingOverlay");
  const filterSupervisor = $("filterSupervisor");
  const filterRegion = $("filterRegion");
  const filterSemana = $("filterSemana");
  const filterMes = $("filterMes");
  const btnClearFilters = $("btnClearFilters");
  const kpiGrid = $("kpiGrid");
  const tableBody = $("tableBody");
  const tableContainer = $("tableContainer");
  const tablePlaceholder = $("tablePlaceholder");
  const btnToggleTable = $("btnToggleTable");
  const toggleLabel = $("toggleLabel");
  const btnExport = $("btnExport");
  const dataCount = $("dataCount");

  /* ── Helpers ───────────────────────────────── */
  const CHART_COLORS = ["#00c2e0", "#2dd4a0", "#f59e42", "#a78bfa", "#f472b6", "#eab308"];

  function fmtCurrency(v, cur) {
    return new Intl.NumberFormat("es-MX", { style: "currency", currency: cur || "MXN", minimumFractionDigits: 2 }).format(v);
  }
  function fmtNumber(v) { return new Intl.NumberFormat("es-MX").format(v); }
  function fmtDate(d) {
    try {
      const dt = new Date(d + "T00:00:00");
      return dt.toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });
    } catch { return d; }
  }
  function totalMXN(o) { return o.registros.reduce((s, r) => s + parseFloat(r.totalMXN || "0"), 0); }
  function totalUSD(o) { return o.registros.reduce((s, r) => s + parseFloat(r.totalUSD || "0"), 0); }

  function getISOWeek(d) {
    const date = new Date(d.getTime());
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
    const week1 = new Date(date.getFullYear(), 0, 4);
    return 1 + Math.round(((date - week1) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
  }

  /* ── Data Processing ───────────────────────── */
  function getUniqueSupervisors(data) {
    return [...new Set(data.map((o) => o.supervisor))].sort();
  }
  function getUniqueRegions(data) {
    return [...new Set(data.map((o) => o.region))].sort();
  }
  function getUniqueWeeks(data) {
    const set = new Set();
    data.forEach((o) => o.registros.forEach((r) => {
      const dt = new Date(r.fecha + "T00:00:00");
      const w = getISOWeek(dt);
      set.add(dt.getFullYear() + "-W" + String(w).padStart(2, "0"));
    }));
    return [...set].sort().map((w) => {
      const [y, wp] = w.split("-W");
      return { value: w, label: "Sem " + wp + " - " + y };
    });
  }
  function getUniqueMonths(data) {
    const set = new Set();
    data.forEach((o) => o.registros.forEach((r) => {
      set.add(r.fecha.substring(0, 7));
    }));
    return [...set].sort().map((m) => {
      const dt = new Date(m + "-01T00:00:00");
      const label = dt.toLocaleDateString("es-MX", { month: "long", year: "numeric" });
      return { value: m, label: label.charAt(0).toUpperCase() + label.slice(1) };
    });
  }

  function filterData(data, f) {
    return data
      .filter((o) => {
        if (f.supervisor && o.supervisor !== f.supervisor) return false;
        if (f.region && o.region !== f.region) return false;
        return true;
      })
      .map((o) => {
        if (!f.semana && !f.mes) return o;
        const regs = o.registros.filter((r) => {
          const dt = new Date(r.fecha + "T00:00:00");
          if (f.semana) {
            const [fy, fw] = f.semana.split("-W").map(Number);
            if (getISOWeek(dt) !== fw || dt.getFullYear() !== fy) return false;
          }
          if (f.mes && r.fecha.substring(0, 7) !== f.mes) return false;
          return true;
        });
        return regs.length ? { ...o, registros: regs } : null;
      })
      .filter(Boolean);
  }

  function getStats(data) {
    const totalOrdenes = data.length;
    const totalRegistros = data.reduce((s, o) => s + o.registros.length, 0);
    let totalIngMXN = 0, totalIngUSD = 0;
    data.forEach((o) => { totalIngMXN += totalMXN(o); totalIngUSD += totalUSD(o); });
    const mediaMXN = totalRegistros > 0 ? totalIngMXN / totalRegistros : 0;

    const byDay = {};
    data.forEach((o) => o.registros.forEach((r) => {
      byDay[r.fecha] = (byDay[r.fecha] || 0) + parseFloat(r.totalMXN || "0");
    }));
    const days = Object.entries(byDay).sort((a, b) => b[1] - a[1]);
    const bestDay = days[0] || null;
    const worstDay = days[days.length - 1] || null;

    const byService = {};
    data.forEach((o) => { byService[o.nombreParte] = (byService[o.nombreParte] || 0) + totalMXN(o); });
    const services = Object.entries(byService).sort((a, b) => b[1] - a[1]);

    const byRegion = {};
    data.forEach((o) => { byRegion[o.region] = (byRegion[o.region] || 0) + totalMXN(o); });
    const regionData = Object.entries(byRegion).map(([r, t]) => ({ region: r, total: t })).sort((a, b) => b.total - a.total);

    const bySupervisor = {};
    data.forEach((o) => { bySupervisor[o.supervisor] = (bySupervisor[o.supervisor] || 0) + totalMXN(o); });

    const dailyIncome = Object.entries(byDay).map(([f, t]) => ({ fecha: f, total: t })).sort((a, b) => a.fecha.localeCompare(b.fecha));

    const prods = data.filter((o) => o.productividad > 0).map((o) => o.productividad);
    const avgProd = prods.length ? prods.reduce((a, b) => a + b, 0) / prods.length : 0;
    const totalHoras = data.reduce((s, o) => s + o.registros.reduce((ss, r) => ss + r.horasAC, 0), 0);
    const totalPiezas = data.reduce((s, o) => s + o.registros.reduce((ss, r) => ss + r.piezasHoras, 0), 0);

    return {
      totalOrdenes, totalRegistros, totalIngMXN, totalIngUSD, mediaMXN,
      bestDay: bestDay ? { fecha: bestDay[0], total: bestDay[1] } : null,
      worstDay: worstDay ? { fecha: worstDay[0], total: worstDay[1] } : null,
      topService: services[0] ? { name: services[0][0], total: services[0][1] } : null,
      bottomService: services.length ? { name: services[services.length - 1][0], total: services[services.length - 1][1] } : null,
      regionData, bySupervisor, dailyIncome, byService, avgProd, totalHoras, totalPiezas,
    };
  }

  /* ── SVG Icons ─────────────────────────────── */
  const icons = {
    clipboard: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>',
    dollar: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
    trendUp: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
    trendDown: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>',
    barChart: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>',
    activity: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
    clock: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    boxes: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z"/><path d="m7 16.5-4.74-2.85"/><path d="m7 16.5 5-3"/><path d="M7 16.5v5.17"/><path d="M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z"/><path d="m17 16.5-5-3"/><path d="m17 16.5 4.74-2.85"/><path d="M17 16.5v5.17"/><path d="M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z"/><path d="M12 8 7.26 5.15"/><path d="m12 8 4.74-2.85"/><path d="M12 13.5V8"/></svg>',
    calendar: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="m9 16 2 2 4-4"/></svg>',
    chevron: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',
  };

  /* ── Render KPIs ───────────────────────────── */
  function renderKPIs(stats) {
    const cards = [
      { title: "Total Ordenes", value: stats.totalOrdenes, sub: stats.totalRegistros + " registros activos", icon: icons.clipboard, color: "cyan" },
      { title: "Ingresos MXN", value: fmtCurrency(stats.totalIngMXN, "MXN"), sub: "Total acumulado en pesos", icon: icons.dollar, color: "green" },
      { title: "Ingresos USD", value: fmtCurrency(stats.totalIngUSD, "USD"), sub: "Total acumulado en dolares", icon: icons.dollar, color: "orange" },
      { title: "Media por Registro", value: fmtCurrency(stats.mediaMXN, "MXN"), sub: "Ingreso promedio MXN", icon: icons.barChart, color: "purple" },
      { title: "Mejor Dia", value: stats.bestDay ? fmtDate(stats.bestDay.fecha) : "N/A", sub: stats.bestDay ? fmtCurrency(stats.bestDay.total, "MXN") : "", icon: icons.trendUp, color: "green" },
      { title: "Menor Dia", value: stats.worstDay ? fmtDate(stats.worstDay.fecha) : "N/A", sub: stats.worstDay ? fmtCurrency(stats.worstDay.total, "MXN") : "", icon: icons.trendDown, color: "red" },
      { title: "Servicio Top", value: stats.topService ? stats.topService.name : "N/A", sub: stats.topService ? fmtCurrency(stats.topService.total, "MXN") : "", icon: icons.trendUp, color: "green" },
      { title: "Menor Servicio", value: stats.bottomService ? stats.bottomService.name : "N/A", sub: stats.bottomService ? fmtCurrency(stats.bottomService.total, "MXN") : "", icon: icons.trendDown, color: "rose" },
      { title: "Productividad Media", value: stats.avgProd.toFixed(1) + "%", sub: "Promedio general", icon: icons.activity, color: "cyan" },
      { title: "Total Horas AC", value: fmtNumber(Math.round(stats.totalHoras * 100) / 100), sub: "Horas acumuladas", icon: icons.clock, color: "orange" },
      { title: "Total Piezas", value: fmtNumber(stats.totalPiezas), sub: "Piezas producidas", icon: icons.boxes, color: "purple" },
      { title: "Registros por Orden", value: (stats.totalOrdenes > 0 ? stats.totalRegistros / stats.totalOrdenes : 0).toFixed(1), sub: "Promedio de registros", icon: icons.calendar, color: "rose" },
    ];
    kpiGrid.innerHTML = cards.map((c) => `
      <div class="kpi-card">
        <div class="kpi-card-head">
          <div class="kpi-icon ${c.color}">${c.icon}</div>
          <span class="kpi-label">${c.title}</span>
        </div>
        <p class="kpi-value">${c.value}</p>
        ${c.sub ? `<p class="kpi-sub">${c.sub}</p>` : ""}
      </div>`).join("");
  }

  /* ── Charts ────────────────────────────────── */
  Chart.defaults.color = "#6b7a99";
  Chart.defaults.borderColor = "#1c2640";
  Chart.defaults.font.family = "'Inter', system-ui, sans-serif";
  Chart.defaults.font.size = 11;
  Chart.defaults.plugins.legend.display = false;

  function renderCharts(stats) {
    // Destroy old charts
    Object.values(charts).forEach((c) => c.destroy());
    charts = {};

    // Region horizontal bar
    charts.region = new Chart($("chartRegion"), {
      type: "bar",
      data: {
        labels: stats.regionData.map((r) => r.region),
        datasets: [{
          data: stats.regionData.map((r) => r.total),
          backgroundColor: stats.regionData.map((_, i) => CHART_COLORS[i % CHART_COLORS.length]),
          borderRadius: 4, barPercentage: 0.7,
        }],
      },
      options: {
        indexAxis: "y", responsive: true, maintainAspectRatio: false,
        scales: {
          x: { ticks: { callback: (v) => "$" + (v / 1000).toFixed(0) + "k" }, grid: { color: "#1c2640" } },
          y: { grid: { display: false } },
        },
        plugins: {
          tooltip: {
            backgroundColor: "#0f1520", borderColor: "#1c2640", borderWidth: 1,
            titleColor: "#6b7a99", bodyColor: "#e4e8f1",
            callbacks: { label: (ctx) => fmtCurrency(ctx.raw, "MXN") },
          },
        },
      },
    });

    // Daily area chart
    charts.daily = new Chart($("chartDaily"), {
      type: "line",
      data: {
        labels: stats.dailyIncome.map((d) => fmtDate(d.fecha)),
        datasets: [{
          data: stats.dailyIncome.map((d) => d.total),
          borderColor: "#00c2e0", borderWidth: 2,
          backgroundColor: "rgba(0, 194, 224, 0.1)",
          fill: true, tension: 0.4, pointRadius: 4,
          pointBackgroundColor: "#00c2e0", pointBorderColor: "#0f1520", pointBorderWidth: 2,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: {
          x: { grid: { color: "#1c2640" }, ticks: { maxRotation: 45 } },
          y: { ticks: { callback: (v) => "$" + (v / 1000).toFixed(0) + "k" }, grid: { color: "#1c2640" } },
        },
        plugins: {
          tooltip: {
            backgroundColor: "#0f1520", borderColor: "#1c2640", borderWidth: 1,
            titleColor: "#6b7a99", bodyColor: "#e4e8f1",
            callbacks: { label: (ctx) => fmtCurrency(ctx.raw, "MXN") },
          },
        },
      },
    });

    // Service doughnut
    const serviceEntries = Object.entries(stats.byService).sort((a, b) => b[1] - a[1]);
    charts.service = new Chart($("chartService"), {
      type: "doughnut",
      data: {
        labels: serviceEntries.map((s) => s[0]),
        datasets: [{
          data: serviceEntries.map((s) => s[1]),
          backgroundColor: serviceEntries.map((_, i) => CHART_COLORS[i % CHART_COLORS.length]),
          borderColor: "#0f1520", borderWidth: 3,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: "60%",
        plugins: {
          legend: { display: true, position: "right", labels: { boxWidth: 10, padding: 12, color: "#6b7a99", font: { size: 11 } } },
          tooltip: {
            backgroundColor: "#0f1520", borderColor: "#1c2640", borderWidth: 1,
            titleColor: "#6b7a99", bodyColor: "#e4e8f1",
            callbacks: { label: (ctx) => " " + fmtCurrency(ctx.raw, "MXN") },
          },
        },
      },
    });

    // Supervisor bar
    const supEntries = Object.entries(stats.bySupervisor).sort((a, b) => b[1] - a[1]);
    charts.supervisor = new Chart($("chartSupervisor"), {
      type: "bar",
      data: {
        labels: supEntries.map((s) => s[0].split(" ").slice(0, 2).join(" ")),
        datasets: [{
          data: supEntries.map((s) => s[1]),
          backgroundColor: supEntries.map((_, i) => CHART_COLORS[i % CHART_COLORS.length]),
          borderRadius: 4, barPercentage: 0.6,
        }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        scales: {
          x: { grid: { display: false } },
          y: { ticks: { callback: (v) => "$" + (v / 1000).toFixed(0) + "k" }, grid: { color: "#1c2640" } },
        },
        plugins: {
          tooltip: {
            backgroundColor: "#0f1520", borderColor: "#1c2640", borderWidth: 1,
            titleColor: "#6b7a99", bodyColor: "#e4e8f1",
            callbacks: {
              title: (items) => supEntries[items[0].dataIndex][0],
              label: (ctx) => fmtCurrency(ctx.raw, "MXN"),
            },
          },
        },
      },
    });
  }

  /* ── Table ─────────────────────────────────── */
  function renderTable(data) {
    dataCount.textContent = "Datos Detallados (" + data.length + " ordenes)";
    if (!data.length) {
      tableBody.innerHTML = '<tr class="empty-row"><td colspan="9">No hay datos disponibles con los filtros seleccionados</td></tr>';
      return;
    }
    tableBody.innerHTML = data.map((o) => {
      const t = totalMXN(o);
      const isOpen = expandedRows.has(o.id);
      let html = `<tr data-id="${o.id}">
        <td class="col-expand"><span class="chevron ${isOpen ? "open" : ""}">${icons.chevron}</span></td>
        <td class="order-id">${o.orden}</td>
        <td>${o.clienteCobro}</td>
        <td>${o.nombreParte}</td>
        <td><span class="badge">${o.region}</span></td>
        <td>${o.plantaTrabajo}</td>
        <td><span class="badge ${o.moneda === "USD" ? "badge-usd" : "badge-mxn"}">${o.moneda}</span></td>
        <td class="total-cell">${fmtCurrency(t, "MXN")}</td>
        <td class="supervisor-cell">${o.supervisor.split(" ").slice(0, 2).join(" ")}</td>
      </tr>`;
      if (isOpen) {
        html += `<tr class="sub-row"><td colspan="9"><div class="sub-content">
          <div class="sub-header">Registros (${o.registros.length})${o.observaciones ? " | Obs: " + o.observaciones : ""}</div>
          <table class="sub-table"><thead><tr>
            <th>Fecha</th><th class="text-right">Piezas/Hr</th><th class="text-right">Horas AC</th>
            <th class="text-right">T. Cambio</th><th class="text-right">USD</th><th class="text-right">MXN</th><th>Obs</th>
          </tr></thead><tbody>
          ${o.registros.map((r) => `<tr>
            <td>${fmtDate(r.fecha)}</td>
            <td class="text-right mono">${r.piezasHoras.toLocaleString("es-MX")}</td>
            <td class="text-right mono">${r.horasAC.toFixed(2)}</td>
            <td class="text-right mono">${r.tipoCambio}</td>
            <td class="text-right mono color-primary">${r.totalUSD || "-"}</td>
            <td class="text-right mono color-accent">${r.totalMXN || "-"}</td>
            <td class="color-muted">${r.observaciones || "-"}</td>
          </tr>`).join("")}
          </tbody></table></div></td></tr>`;
      }
      return html;
    }).join("");

    // Row click handlers
    tableBody.querySelectorAll("tr[data-id]").forEach((row) => {
      row.addEventListener("click", () => {
        const id = parseInt(row.dataset.id);
        if (expandedRows.has(id)) expandedRows.delete(id); else expandedRows.add(id);
        renderTable(data);
      });
    });
  }

  /* ── CSV Export ─────────────────────────────── */
  function exportCSV(data) {
    const headers = ["Orden", "Cliente", "Planta", "Parte", "Region", "Costo", "Moneda", "Supervisor", "Fecha Registro", "Piezas/Hora", "Horas AC", "Tipo Cambio", "Total USD", "Total MXN", "Observaciones Registro"];
    const rows = [];
    data.forEach((o) => {
      o.registros.forEach((r) => {
        rows.push([o.orden, o.clienteCobro, o.plantaTrabajo, o.nombreParte, o.region, o.costo, o.moneda, o.supervisor, r.fecha, r.piezasHoras, r.horasAC.toFixed(2), r.tipoCambio, r.totalUSD || "0", r.totalMXN || "0", r.observaciones || ""]);
      });
    });
    const BOM = "\uFEFF";
    const csv = BOM + [headers.join(","), ...rows.map((r) => r.map((c) => '"' + String(c).replace(/"/g, '""') + '"').join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ordenes_" + new Date().toISOString().split("T")[0] + ".csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  /* ── Populate Filters ──────────────────────── */
  function populateFilters() {
    const supervisors = getUniqueSupervisors(allData);
    const regions = getUniqueRegions(allData);
    const weeks = getUniqueWeeks(allData);
    const months = getUniqueMonths(allData);

    filterSupervisor.innerHTML = '<option value="">Todos los supervisores</option>' + supervisors.map((s) => '<option value="' + s + '"' + (filters.supervisor === s ? " selected" : "") + '>' + s + '</option>').join("");
    filterRegion.innerHTML = '<option value="">Todas las regiones</option>' + regions.map((r) => '<option value="' + r + '"' + (filters.region === r ? " selected" : "") + '>' + r + '</option>').join("");
    filterSemana.innerHTML = '<option value="">Todas las semanas</option>' + weeks.map((w) => '<option value="' + w.value + '"' + (filters.semana === w.value ? " selected" : "") + '>' + w.label + '</option>').join("");
    filterMes.innerHTML = '<option value="">Todos los meses</option>' + months.map((m) => '<option value="' + m.value + '"' + (filters.mes === m.value ? " selected" : "") + '>' + m.label + '</option>').join("");
  }

  /* ── Full Render ───────────────────────────── */
  function render() {
    const filtered = filterData(allData, filters);
    const stats = getStats(filtered);
    const hasFilters = Object.values(filters).some((v) => v !== "");
    btnClearFilters.classList.toggle("hidden", !hasFilters);
    renderKPIs(stats);
    renderCharts(stats);
    renderTable(filtered);
  }

  /* ── Date Inputs ────────────────────────────── */
  function checkDateInputs() {
    const hasStart = fechaInicio.value !== "";
    const hasEnd = fechaFin.value !== "";
    btnQuery.disabled = !(hasStart && hasEnd);
  }

  /* ── Event Bindings ────────────────────────── */
  fechaInicio.addEventListener("change", checkDateInputs);
  fechaFin.addEventListener("change", checkDateInputs);

  btnQuery.addEventListener("click", async () => {
    const start = fechaInicio.value;
    const end = fechaFin.value;
    if (!start || !end) return;

    queryError.classList.add("hidden");
    queryInfo.classList.add("hidden");
    loadingOverlay.classList.remove("hidden");
    btnQuery.disabled = true;

    try {
      // *** MODIFICA ESTA URL CON LA DE TU BACKEND ***
      const url = `http://tu-api.com/api/ordenes?fechaInicio=${start}&fechaFin=${end}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Error " + response.status + ": " + response.statusText);
      const data = await response.json();

      if (Array.isArray(data)) {
        allData = data;
      } else if (data && data.data && Array.isArray(data.data)) {
        allData = data.data;
      } else {
        throw new Error("Formato de respuesta no reconocido");
      }

      queryInfo.innerHTML = 'Consulta: <span>' + start + '</span> a <span>' + end + '</span> — ' + allData.length + ' ordenes cargadas';
      queryInfo.classList.remove("hidden");

      populateFilters();
      expandedRows.clear();
      render();
    } catch (err) {
      queryError.textContent = err.message || "Error al consultar el servidor";
      queryError.classList.remove("hidden");
    } finally {
      loadingOverlay.classList.add("hidden");
      checkDateInputs();
    }
  });

  [filterSupervisor, filterRegion, filterSemana, filterMes].forEach((sel) => {
    sel.addEventListener("change", () => {
      filters.supervisor = filterSupervisor.value;
      filters.region = filterRegion.value;
      filters.semana = filterSemana.value;
      filters.mes = filterMes.value;
      expandedRows.clear();
      render();
    });
  });

  btnClearFilters.addEventListener("click", () => {
    filters = { supervisor: "", region: "", semana: "", mes: "" };
    populateFilters();
    expandedRows.clear();
    render();
  });

  btnToggleTable.addEventListener("click", () => {
    tableVisible = !tableVisible;
    tableContainer.classList.toggle("hidden", !tableVisible);
    tablePlaceholder.classList.toggle("hidden", tableVisible);
    toggleLabel.textContent = tableVisible ? "Ocultar" : "Mostrar Tabla";
  });

  btnExport.addEventListener("click", () => {
    const filtered = filterData(allData, filters);
    exportCSV(filtered);
  });

  /* ── Init ──────────────────────────────────── */
  
  
// })();
document.addEventListener("DOMContentLoaded", () => {
    populateFilters();
    render();  
  })