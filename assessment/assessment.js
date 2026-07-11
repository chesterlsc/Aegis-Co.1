(function () {
  "use strict";

  if (window.location.protocol.startsWith("http") && window.location.pathname.endsWith("/index.html")) {
    var cleanPath = window.location.pathname.replace(/index\.html$/, "");
    window.history.replaceState(null, "", cleanPath + window.location.search + window.location.hash);
  }

  var header = document.querySelector(".assessment-header");
  var menuToggle = document.querySelector(".assessment-menu-toggle");
  var nav = document.querySelector("#assessment-nav");
  var form = document.querySelector("#assessment-form");
  var message = document.querySelector("#assessment-form-message");
  var steps = Array.from(form ? form.querySelectorAll(".assessment-step") : []);
  var backButton = form ? form.querySelector("[data-wizard-back]") : null;
  var nextButton = form ? form.querySelector("[data-wizard-next]") : null;
  var submitButton = form ? form.querySelector(".assessment-submit") : null;
  var submitMicrocopy = form ? form.querySelector("[data-submit-microcopy]") : null;
  var progressCurrent = form ? form.querySelector("[data-progress-current]") : null;
  var progressBar = form ? form.querySelector("[data-progress-bar]") : null;

  if (header && menuToggle && nav) {
    menuToggle.addEventListener("click", function () {
      var isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      header.classList.toggle("is-menu-open", !isOpen);
    });

    nav.addEventListener("click", function (event) {
      if (!event.target.closest("a")) return;
      menuToggle.setAttribute("aria-expanded", "false");
      header.classList.remove("is-menu-open");
    });
  }

  if (!form || !message || !steps.length || !backButton || !nextButton || !submitButton || !progressCurrent || !progressBar) return;

  var currentStep = 0;
  var isSubmitting = false;
  var userFieldNames = [
    "name",
    "email",
    "business_name",
    "business_description",
    "business_stage",
    "friction_area",
    "current_truth",
    "next_6_12_months",
    "operating_correctly",
    "why_now",
    "investment_level",
    "readiness",
    "_gotcha",
  ];

  var fixedFields = {
    brand: "Aegis & Co.",
    form_type: "System Assessment",
    source_page: "Assessment",
    subject: "[ AEGIS ] System Assessment Submission",
  };

  var formatStep = function (index) {
    return String(index + 1).padStart(2, "0");
  };

  var setMessage = function (text, type) {
    message.textContent = text;
    message.dataset.state = type;
  };

  var setStepError = function (step, text) {
    var error = step.querySelector(".assessment-step-error");
    step.dataset.invalid = text ? "true" : "false";
    if (error) error.textContent = text;
  };

  var getStepControls = function (step) {
    return Array.from(step.querySelectorAll("input, textarea")).filter(function (control) {
      return control.name && control.name !== "_gotcha";
    });
  };

  var validateStep = function (step, shouldFocus) {
    var focusInvalid = shouldFocus !== false;
    var controls = getStepControls(step);
    var firstRadio = controls.find(function (control) {
      return control.type === "radio";
    });

    if (firstRadio) {
      var checked = controls.some(function (control) {
        return control.checked;
      });
      if (!checked) {
        setStepError(step, "Please choose one option before continuing.");
        if (focusInvalid) firstRadio.focus();
        return false;
      }

      setStepError(step, "");
      return true;
    }

    var field = controls[0];
    var value = field ? field.value.trim() : "";

    if (!value) {
      setStepError(step, "Please answer this question before continuing.");
      if (focusInvalid && field) field.focus();
      return false;
    }

    if (field.maxLength > 0 && value.length > field.maxLength) {
      setStepError(step, "Please shorten this answer before continuing.");
      if (focusInvalid) field.focus();
      return false;
    }

    if (field.type === "email" && !field.validity.valid) {
      setStepError(step, "Please enter a valid email before continuing.");
      if (focusInvalid) field.focus();
      return false;
    }

    setStepError(step, "");
    return true;
  };

  var getFieldValue = function (name) {
    var control = form.elements.namedItem(name);
    return control && typeof control.value === "string" ? control.value.trim() : "";
  };

  var buildSubmission = function () {
    var submission = new FormData();

    Object.keys(fixedFields).forEach(function (name) {
      submission.append(name, fixedFields[name]);
    });

    userFieldNames.forEach(function (name) {
      submission.append(name, getFieldValue(name));
    });

    return submission;
  };

  var focusActiveStep = function () {
    var activeStep = steps[currentStep];
    var target = activeStep.querySelector("input, textarea");
    if (target) target.focus({ preventScroll: true });
  };

  var updateStep = function (index, shouldFocus) {
    currentStep = Math.max(0, Math.min(index, steps.length - 1));

    steps.forEach(function (step, stepIndex) {
      var isActive = stepIndex === currentStep;
      step.hidden = !isActive;
      step.classList.toggle("is-active", isActive);
    });

    var isFinal = currentStep === steps.length - 1;
    progressCurrent.textContent = formatStep(currentStep);
    progressBar.dataset.step = String(currentStep + 1);
    backButton.hidden = currentStep === 0;
    nextButton.hidden = isFinal;
    submitButton.hidden = !isFinal;
    if (submitMicrocopy) submitMicrocopy.hidden = !isFinal;

    form.dataset.currentStep = String(currentStep + 1);
    setMessage("", "");

    if (shouldFocus !== false) focusActiveStep();
  };

  form.addEventListener("input", function (event) {
    var step = event.target.closest(".assessment-step");
    if (step) setStepError(step, "");
  });

  form.addEventListener("change", function (event) {
    var step = event.target.closest(".assessment-step");
    if (step) setStepError(step, "");
  });

  backButton.addEventListener("click", function () {
    updateStep(currentStep - 1);
  });

  nextButton.addEventListener("click", function () {
    var activeStep = steps[currentStep];
    if (!validateStep(activeStep)) return;
    updateStep(currentStep + 1);
  });

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    if (isSubmitting) return;

    for (var index = 0; index < steps.length; index += 1) {
      if (!validateStep(steps[index], false)) {
        updateStep(index);
        validateStep(steps[index]);
        return;
      }
    }

    if (!window.fetch || !window.location.protocol.startsWith("http")) {
      setMessage("Secure submission is unavailable in this browser. Please try again from the live site.", "error");
      return;
    }

    isSubmitting = true;
    submitButton.disabled = true;
    submitButton.textContent = submitButton.dataset.loadingText;
    setMessage("", "");

    var controller = new AbortController();
    var timeoutId = window.setTimeout(function () {
      controller.abort();
    }, 15000);

    try {
      var response = await fetch(form.action, {
        method: "POST",
        body: buildSubmission(),
        headers: { Accept: "application/json" },
        signal: controller.signal,
      });

      if (!response.ok) {
        setMessage("We couldn't accept the assessment. Your answers are still here, so please review them and try once more.", "error");
        return;
      }

      form.reset();
      steps.forEach(function (step) {
        setStepError(step, "");
      });
      updateStep(0, false);
      setMessage(
        "assessment received. thank you. we’ll review your submission carefully and follow up if there’s a strong fit.",
        "success"
      );
    } catch (_error) {
      setMessage("We couldn't confirm the submission. Your answers are still here. Please wait a moment and try once.", "error");
    } finally {
      window.clearTimeout(timeoutId);
      isSubmitting = false;
      submitButton.disabled = false;
      submitButton.textContent = submitButton.dataset.defaultText;
    }
  });

  updateStep(0, false);
})();
