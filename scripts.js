(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealItems = document.querySelectorAll("[data-reveal]");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach(function (el) {
      el.classList.add("is-visible");
    });
  } else if (revealItems.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );

    revealItems.forEach(function (el) {
      observer.observe(el);
    });
  }

  var header = document.querySelector(".site-header");
  if (header) {
    var setScrolled = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    setScrolled();
    window.addEventListener("scroll", setScrolled, { passive: true });
  }

  /* ---------------- revenue-leak console ---------------- */

  var IC = {
    form: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M9 13h6M9 17h4"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.9.6 2.8.7a2 2 0 0 1 1.7 2Z"/></svg>',
    msg: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.4 8.6 8.6 0 0 1-3.7-.8L3 21l1.9-5.7a8.4 8.4 0 1 1 16.1-3.8Z"/></svg>',
    brain: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 5V3M12 21v-2M5 12H3M21 12h-2M6.3 6.3 4.9 4.9M19.1 19.1l-1.4-1.4M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4"/></svg>',
    cal: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M9 16l2 2 4-4"/></svg>',
    db: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3"/></svg>',
    bell: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0"/></svg>',
    cart: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1.5"/><circle cx="19" cy="21" r="1.5"/><path d="M2 3h3l2.7 12.4a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 2-1.6L22 7H6"/></svg>',
    box: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8 12 3 3 8v8l9 5 9-5V8Z"/><path d="M3 8l9 5 9-5M12 13v8"/></svg>',
    doc: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h5"/></svg>',
    hand: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 11V7a5 5 0 0 1 10 0v4M5 11h14l-1 10H6L5 11Z"/></svg>',
    dash: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>',
    tasks: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="m8 12 3 3 5-6"/></svg>',
    team: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/></svg>',
    sync: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>',
    send: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>',
    chart: '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18M8 17V9M13 17V5M18 17v-7"/></svg>'
  };

  var C = { blue: "#4F7DFF", green: "#34D399", purple: "#A78BFA", amber: "#FBBF24", orange: "#FB923C", cyan: "#38BDF8" };

  var node = function (n) {
    return (
      '<div class="fnode" style="--nacc:' + (n.c || "var(--acc)") + '">' +
      (n.num ? '<span class="num">' + n.num + "</span>" : "") +
      '<span class="fic">' + IC[n.ic] + "</span>" +
      '<span style="min-width:0"><b>' + n.b + "</b>" + (n.s ? "<small>" + n.s + "</small>" : "") + "</span>" +
      "</div>"
    );
  };

  var head = function (d) {
    return (
      '<h4 class="c-head">' + d.headline + "</h4>" +
      '<div class="po-strip">' +
      '<div class="po bad"><b>THE PROBLEM</b>' + d.problem + "</div>" +
      '<div class="po good"><b>THE OUTCOME</b>' + d.outcome + "</div>" +
      "</div>"
    );
  };

  var DIAGRAMS = {
    converge: function (d) {
      return (
        head(d) +
        '<div class="dg-converge">' +
        '<div class="dg-col">' + d.inputs.map(node).join("") + "</div>" +
        '<div class="arr">→</div>' +
        '<div class="ainode">' +
        '<div class="ai-t">' + IC.brain + "<b>AI QUALIFIES</b></div>" +
        "<ul>" + d.checks.map(function (c) { return "<li>" + c + "</li>"; }).join("") + "</ul>" +
        "</div>" +
        '<div class="arr">→</div>' +
        '<div class="dg-col">' + d.outputs.map(node).join("") + "</div>" +
        "</div>"
      );
    },
    timeline: function (d) {
      return (
        head(d) +
        '<span class="tl-badge">◷ 24/7 — INCLUDING THE HOURS YOUR TEAM SLEEPS</span>' +
        '<div class="dg-timeline">' +
        d.events
          .map(function (e) {
            return '<div class="tl-item"><time class="' + (e.night ? "night" : "") + '">' + e.t + "</time>" + node(e) + "</div>";
          })
          .join("") +
        "</div>"
      );
    },
    conveyor: function (d) {
      var row = function (arr, back) {
        return (
          '<div class="cv-row ' + (back ? "back" : "") + '">' +
          node(arr[0]) + '<div class="arr">' + (back ? "←" : "→") + "</div>" +
          node(arr[1]) + '<div class="arr">' + (back ? "←" : "→") + "</div>" +
          node(arr[2]) +
          "</div>"
        );
      };
      return (
        head(d) +
        '<div class="dg-conveyor">' +
        row(d.row1, false) +
        '<div class="cv-turn"><div class="arr">↓</div></div>' +
        row(d.row2, true) +
        "</div>"
      );
    },
    fanout: function (d) {
      return (
        head(d) +
        '<div class="dg-fan">' +
        node(d.trigger) +
        '<div class="arr">↓</div>' +
        '<div class="fan-bracket" aria-hidden="true"></div>' +
        '<div class="fan-row">' + d.branches.map(node).join("") + "</div>" +
        '<div class="fan-bracket flip" aria-hidden="true"></div>' +
        '<div class="arr">↓</div>' +
        node(d.final) +
        "</div>"
      );
    },
    loop: function (d) {
      var placed = function (item, num, pos) {
        var n = { ic: item.ic, b: item.b, s: item.s, c: item.c, num: num };
        return node(n).replace('class="fnode"', 'class="fnode ' + pos + '"');
      };
      return (
        head(d) +
        '<div class="dg-loop">' +
        '<div class="ring" aria-hidden="true"></div>' +
        '<div class="core" aria-hidden="true">' + IC.shield + "</div>" +
        placed(d.cycle[0], 1, "pos-t") +
        placed(d.cycle[1], 2, "pos-r") +
        placed(d.cycle[2], 3, "pos-b") +
        placed(d.cycle[3], 4, "pos-l") +
        "</div>"
      );
    }
  };

  var LEAKS = [
    {
      acc: C.blue,
      layout: "converge",
      kicker: "REVENUE LEAK 01 / 05",
      sys: "SYS: LEAD_QUAL_v2.1",
      title: "Lead Qualification",
      headline: "Never miss a <em>qualified lead</em> again.",
      problem: "Leads come from everywhere. No consistent qualification. Slow routing.",
      outcome: "Qualified leads are routed instantly. Teams close more.",
      when: "Leads arrive from multiple channels and <b>no one owns the next step.</b>",
      fixes: "Slow response, missed follow-up, unclear routing.",
      measured: "Speed to lead, booked calls, qualified lead rate.",
      inputs: [
        { ic: "form", b: "Form Filled", s: "Website / landing page", c: C.blue },
        { ic: "phone", b: "Call Received", s: "Phone / call tracking", c: C.green },
        { ic: "msg", b: "Message Received", s: "Chat / SMS / social", c: C.purple }
      ],
      checks: ["Contact valid", "Intent detected", "Lead scored", "Calendar checked"],
      outputs: [
        { ic: "cal", b: "Calendar Updated", s: "Availability confirmed", c: C.cyan },
        { ic: "db", b: "CRM Updated", s: "Created with full context", c: C.purple },
        { ic: "bell", b: "You Get Notified", s: "Right lead, right time", c: C.orange }
      ],
      stats: [
        { v: "+18%", c: "up", l: "Lead capture" },
        { v: "−52%", c: "down", l: "Response time" },
        { v: "+11%", c: "up", l: "Conversion rate" }
      ]
    },
    {
      acc: C.green,
      layout: "timeline",
      kicker: "REVENUE LEAK 02 / 05",
      sys: "SYS: 24-7_DESK_v1.8",
      title: "Follow-up & Booking",
      headline: "Your 24/7 front desk <em>that never sleeps.</em>",
      problem: "Missed after-hours calls. Inconsistent intake. Slow follow-up and handoff.",
      outcome: "Faster response. Better follow-up. Every call handled.",
      when: "Calls, messages, and requests <b>sit until someone checks them.</b>",
      fixes: "Missed calls, manual callbacks, stalled booking.",
      measured: "Response time, booked jobs, callback completion.",
      events: [
        { t: "11:47 PM", night: true, ic: "phone", b: "Customer Calls", s: "After hours — office closed", c: C.blue },
        { t: "11:47 PM", night: true, ic: "brain", b: "AI Answers Instantly", s: "Intake handled seamlessly", c: C.green },
        { t: "11:49 PM", night: true, ic: "send", b: "Call Routed + Summary Sent", s: "Full context, zero notes lost", c: C.orange },
        { t: "11:50 PM", night: true, ic: "db", b: "CRM Updated", s: "Job logged while you sleep", c: C.purple },
        { t: "08:02 AM", ic: "cal", b: "Booking Confirmed", s: "Customer messaged, job on calendar", c: C.cyan }
      ],
      stats: [
        { v: "−41%", c: "down", l: "Missed calls" },
        { v: "+58%", c: "up", l: "Response speed" },
        { v: "+27%", c: "up", l: "Follow-up rate" }
      ]
    },
    {
      acc: C.purple,
      layout: "conveyor",
      kicker: "REVENUE LEAK 03 / 05",
      sys: "SYS: ORDER_TO_ACCT_v1.4",
      title: "Fulfillment Handoffs",
      headline: "From checkout to accounting, <em>handled in seconds.</em>",
      problem: "Inventory updates manually. Transactions take time to log. Reporting lags.",
      outcome: "Inventory, records, and reporting stay current on their own.",
      when: "Client work moves from sales to operations <b>by memory.</b>",
      fixes: "Dropped details, manual updates, reporting gaps.",
      measured: "Handoff completion, CRM accuracy, stalled work.",
      row1: [
        { ic: "cart", b: "Order Placed", s: "Customer completes checkout", c: C.blue },
        { ic: "box", b: "Inventory Auto-Updated", s: "Stock levels update instantly", c: C.green },
        { ic: "db", b: "Transaction Logged", s: "Payment + order details recorded", c: C.purple }
      ],
      row2: [
        { ic: "dash", b: "Dashboard Updated", s: "KPIs refresh in real time", c: C.blue },
        { ic: "hand", b: "Customer Thanked", s: "Confirmation sent instantly", c: C.green },
        { ic: "doc", b: "Report Generated", s: "Financial + sales reports created", c: C.orange }
      ],
      stats: [
        { v: "−58%", c: "down", l: "Manual admin" },
        { v: "−46%", c: "down", l: "Reporting delay" },
        { v: "+17%", c: "up", l: "Order accuracy" }
      ]
    },
    {
      acc: C.amber,
      layout: "fanout",
      kicker: "REVENUE LEAK 04 / 05",
      sys: "SYS: BACKOFFICE_v1.2",
      title: "Back Office Admin",
      headline: "Your back office, <em>on autopilot.</em>",
      problem: "Repetitive setup tasks. Inconsistent internal handoff. Time lost to admin.",
      outcome: "One trigger, multiple actions. Teams start faster, operations stay organized.",
      when: "Admin work keeps <b>pulling the team away from client work.</b>",
      fixes: "Manual entry, repeat checks, delayed internal updates.",
      measured: "Admin hours saved, error rate, processing time.",
      trigger: { ic: "form", b: "Form Filled", s: "One trigger starts everything", c: C.blue },
      branches: [
        { ic: "mail", b: "Welcome Email Sent", c: C.blue },
        { ic: "tasks", b: "Tasks Assigned", c: C.green },
        { ic: "doc", b: "Templates Created", c: C.purple },
        { ic: "cal", b: "Calendar Updated", c: C.orange }
      ],
      final: { ic: "team", b: "Team Notified", s: "Everyone aligned, zero manual setup", c: C.amber },
      stats: [
        { v: "+29%", c: "up", l: "Onboarding speed" },
        { v: "−54%", c: "down", l: "Admin time" },
        { v: "+32%", c: "up", l: "Setup consistency" }
      ]
    },
    {
      acc: C.cyan,
      layout: "loop",
      kicker: "REVENUE LEAK 05 / 05",
      sys: "SYS: DAILY_REPORT_v1.6",
      title: "Reporting & Visibility",
      headline: "Start every day <em>with clarity.</em>",
      problem: "Data lives in different tools. Manual reporting slows decisions.",
      outcome: "Summaries arrive automatically. Teams start informed, every day.",
      when: "Problems are only visible <b>after they already cost time or revenue.</b>",
      fixes: "Late reporting, hidden bottlenecks, unclear ownership.",
      measured: "Daily visibility, stalled-work alerts, decision speed.",
      cycle: [
        { ic: "sync", b: "Daily Data Sync", s: "Every tool feeds in", c: C.blue },
        { ic: "brain", b: "AI Analyzes", s: "Signals + stalls detected", c: C.green },
        { ic: "chart", b: "Summaries Generated", s: "One operating snapshot", c: C.purple },
        { ic: "send", b: "Report Sent", s: "In your inbox before 8am", c: C.orange }
      ],
      stats: [
        { v: "−58%", c: "down", l: "Reporting time" },
        { v: "+34%", c: "up", l: "Visibility" },
        { v: "+21%", c: "up", l: "Decision speed" }
      ]
    }
  ];

  var frame = document.getElementById("consoleFrame");
  var body = document.getElementById("consoleBody");
  var statsEl = document.getElementById("consoleStats");
  var panel = document.getElementById("leakPanel");

  if (frame && body && statsEl && panel) {
    var render = function (i) {
      var d = LEAKS[i];
      frame.style.setProperty("--acc", d.acc);
      document.getElementById("sysTag").textContent = d.sys;
      document.getElementById("specKicker").textContent = d.kicker;
      document.getElementById("specTitle").textContent = d.title;
      document.getElementById("specWhen").innerHTML = d.when;
      document.getElementById("specFixes").textContent = d.fixes;
      document.getElementById("specMeasured").textContent = d.measured;
      body.innerHTML = DIAGRAMS[d.layout](d);
      statsEl.innerHTML = d.stats
        .map(function (s) {
          return '<div class="cstat"><b class="' + s.c + '">' + s.v + "</b><span>" + s.l + "</span></div>";
        })
        .join("");
    };

    var tabs = Array.prototype.slice.call(document.querySelectorAll(".tab"));
    tabs.forEach(function (t) {
      t.addEventListener("click", function () {
        tabs.forEach(function (x) {
          x.setAttribute("aria-selected", "false");
        });
        t.setAttribute("aria-selected", "true");
        t.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", inline: "center", block: "nearest" });
        panel.classList.remove("swap");
        void panel.offsetWidth;
        panel.classList.add("swap");
        render(Number(t.dataset.leak));
      });
    });

    render(0);

    var rail = document.getElementById("tabRail");
    var shell = document.getElementById("tabsShell");
    if (rail && shell) {
      var checkRail = function () {
        shell.classList.toggle("scrollable", rail.scrollWidth > rail.clientWidth + 4);
      };
      checkRail();
      window.addEventListener("resize", checkRail);
      if ("ResizeObserver" in window) {
        new ResizeObserver(checkRail).observe(rail);
      }
    }
  }

  document.querySelectorAll(".module").forEach(function (card) {
    card.addEventListener("pointermove", function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty("--mx", e.clientX - r.left + "px");
      card.style.setProperty("--my", e.clientY - r.top + "px");
    });
  });
})();
