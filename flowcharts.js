(function () {
  "use strict";

  var flowData = {
    "lead-qualification": {
      eyebrow: "flow: lead qualification",
      title: "Lead Qualification Workflow",
      sequence: "Capture \u2192 Qualify \u2192 Route \u2192 Notify",
      image: "assets/flows/lead-qualification.png",
      alt: "Aegis lead qualification flowchart showing capture, AI qualification, routing, CRM updates, and lead notifications.",
    },
    "order-to-accounting": {
      eyebrow: "flow: order to accounting",
      title: "Order to Accounting Workflow",
      sequence: "Order \u2192 Validate \u2192 Record \u2192 Report",
      image: "assets/flows/order-to-accounting.png",
      alt: "Aegis order to accounting flowchart showing order intake, validation, accounting updates, and reporting outputs.",
    },
    "call-handling": {
      eyebrow: "flow: 24/7 call handling",
      title: "24/7 Call Handling Workflow",
      sequence: "Answer \u2192 Route \u2192 Update \u2192 Follow Up",
      image: "assets/flows/call-handling.png",
      alt: "Aegis 24/7 call handling flowchart showing customer calls, AI answers, routing, CRM updates, and customer follow-up.",
    },
    "back-office-automation": {
      eyebrow: "flow: back office automation",
      title: "Back Office Automation Workflow",
      sequence: "Capture \u2192 Standardize \u2192 Approve \u2192 Complete",
      image: "assets/flows/back-office-automation.png",
      alt: "Aegis back office automation flowchart showing intake, task automation, approvals, updates, and operations visibility.",
    },
    "daily-reporting": {
      eyebrow: "flow: daily reporting",
      title: "Daily Reporting Loop Workflow",
      sequence: "Collect \u2192 Report \u2192 Review \u2192 Decide",
      image: "assets/flows/daily-reporting-loop.png",
      alt: "Aegis daily reporting loop flowchart showing data capture, reporting automation, review, and decision visibility.",
    },
  };

  var flowButtons = Array.from(document.querySelectorAll(".flow-nav-item"));
  var flowEyebrow = document.querySelector("#flow-eyebrow");
  var flowTitle = document.querySelector("#flow-title");
  var flowSequence = document.querySelector("#flow-sequence");
  var flowImage = document.querySelector("#flow-image");

  var activateFlow = function (id, updateHash) {
    var shouldUpdateHash = updateHash !== false;
    var activeFlow = flowData[id] || flowData["lead-qualification"];
    var activeId = flowData[id] ? id : "lead-qualification";

    flowButtons.forEach(function (button) {
      if (button.dataset.flow === activeId) {
        button.setAttribute("aria-current", "true");
        if (window.matchMedia("(max-width: 760px)").matches) {
          button.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        }
      } else {
        button.removeAttribute("aria-current");
      }
    });

    flowEyebrow.textContent = activeFlow.eyebrow;
    flowTitle.textContent = activeFlow.title;
    flowSequence.textContent = activeFlow.sequence;
    flowImage.src = activeFlow.image;
    flowImage.alt = activeFlow.alt;

    if (shouldUpdateHash) {
      history.replaceState(null, "", "#" + activeId);
    }
  };

  if (flowButtons.length && flowEyebrow && flowTitle && flowSequence && flowImage) {
    flowButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        activateFlow(button.dataset.flow);
      });
    });

    var initialFlow = window.location.hash.slice(1);
    activateFlow(initialFlow || "lead-qualification", false);
  }
})();
