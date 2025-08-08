
    document.addEventListener('DOMContentLoaded', function () {
      const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxI_5lWR-Bvk-FfqFgM2yp_tCgbGcUqxQY1kgPgAMb-7FdpyFTlfp3cvkBNoW2uTou77w/exec";

      const healthCenterSelect = document.getElementById('healthCenter');
      const departmentSelect = document.getElementById('department');
      const roleSelect = document.getElementById('role');

      function populateSelect(selectElem, options, placeholderText, allowTyping = true, allowCreate = true, sort = true) {
        const defaultOption = new Option(placeholderText, "", true, true);
        defaultOption.disabled = true;
        selectElem.add(defaultOption);

        if (sort) {
          options.sort();
        }

        options.forEach(value => {
          const option = new Option(value, value);
          selectElem.add(option);
        });

        new TomSelect(selectElem, {
          create: allowCreate,
          placeholder: placeholderText,
          maxItems: 1,
          sortField: sort ? "text" : undefined,
        });
      }

      fetch(WEB_APP_URL + "?action=getDropdownData")
        .then(response => response.json())
        .then(data => {
          populateSelect(healthCenterSelect, data.healthCenters, "Select a Health Center", true, false, false);
          populateSelect(departmentSelect, data.departments, "Select a Department", true, true, true);
          populateSelect(roleSelect, data.roles, "Select a Role or Function", true, true, true);
        })
        .catch(err => {
          console.error(err);
          const alertBox = document.getElementById('formAlert');
          alertBox.className = 'alert alert-danger';
          alertBox.textContent = 'Failed to load dropdown data. Please refresh.';
          alertBox.classList.remove('d-none');
        });

      // Enable submit button only if agreement checkbox checked
      const agreementCheckbox = document.getElementById('agreementCheckbox');
      const submitBtn = document.getElementById('submitBtn');
      agreementCheckbox.addEventListener('change', () => {
        submitBtn.disabled = !agreementCheckbox.checked;
      });

      // Form submission
      const form = document.getElementById('contactForm');
      const alertBox = document.getElementById('formAlert');
      const scriptURL = 'https://script.google.com/macros/s/AKfycbzL2KKwec0TU0r-WpsrVoSZykstA1v8Am4fvlQN6J-W8manlp32_JWG0UH41OsbQe3ZAA/exec';

      form.addEventListener('submit', e => {
        e.preventDefault();
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Submitting...';

        const formData = new FormData(form);

        fetch(scriptURL, { method: 'POST', body: formData })
          .then(response => {
            if (!response.ok) throw new Error('Submission failed');
            return response;
          })
          .then(() => {
            alertBox.className = 'alert alert-success';
            alertBox.innerHTML = '<i class="bi bi-check-circle-fill me-2"></i>Contact information submitted successfully.';
            alertBox.classList.remove('d-none');
            form.reset();
            submitBtn.disabled = true; // disable submit until agreement rechecked
            submitBtn.innerHTML = '<i class="bi bi-send-check-fill me-1"></i> Submit';
            agreementCheckbox.checked = false;
          })
          .catch(error => {
            console.error('Error!', error.message);
            alertBox.className = 'alert alert-danger';
            alertBox.innerHTML = '<i class="bi bi-exclamation-triangle-fill me-2"></i>Error submitting data. Try again.';
            alertBox.classList.remove('d-none');
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="bi bi-send-check-fill me-1"></i> Submit';
          })
          .finally(() => {
            alertBox.scrollIntoView({ behavior: 'smooth' });
          });
      });
    });
