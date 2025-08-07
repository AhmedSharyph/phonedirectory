<script>
    const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwndImcPMsQCTx1xLtxolE7Q7nOdN_nVpmOh7fw0U0Sy0-0u30Chp6ovUVhJgk2XdRuNg/exec';

    function normalize(str) {
      return (str || '').toString().toLowerCase().replace(/\s+/g, ' ').trim();
    }

    let allRows = [];

    async function loadData() {
      const container = document.getElementById('directoryContainer');
      try {
        const res = await fetch(WEB_APP_URL);
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);

        const data = await res.json();

        if (!Array.isArray(data) || data.length === 0) {
          container.innerHTML = '<p class="no-results">No data found.</p>';
          return;
        }

        container.innerHTML = '';

        const grouped = {};
        data.forEach(item => {
          const center = String(item['Health Center'] || 'Unknown').trim();
          if (!grouped[center]) grouped[center] = [];
          grouped[center].push(item);
        });

        for (const center in grouped) {
          const section = document.createElement('section');
          section.className = 'center-group';
          section.dataset.center = center.toLowerCase();

          const rowsHtml = grouped[center].map(person => {
            const fullName = String(person['Assigned To'] || '').trim();
            const role = String(person['Role  or Function'] || '').trim();
            const dept = String(person['Department'] || '').trim();
            const phoneRaw = person['Contact Number'] || '';
            const phone = String(phoneRaw).trim();

            const searchText = normalize(`${center} ${fullName} ${role} ${dept} ${phone}`);

            return `
              <tr class="data-row" data-search="${searchText}">
                <td><a href="tel:${phone}" class="text-decoration-none">📞 ${phone}</a></td>
                <td>${dept}</td>
                <td>${fullName}</td>
                <td>${role}</td>
              </tr>`;
          }).join('');

          section.innerHTML = `
            <h2>${center}</h2>
            <div class="table-responsive">
              <table class="table table-striped table-hover sortable-table">
                <thead class="table-light">
                  <tr>
                    <th data-col="0">Phone <span class="sort-arrow"></span></th>
                    <th data-col="1">Department <span class="sort-arrow"></span></th>
                    <th data-col="2">Assigned To <span class="sort-arrow"></span></th>
                    <th data-col="3">Role or Function <span class="sort-arrow"></span></th>
                  </tr>
                </thead>
                <tbody>
                  ${rowsHtml}
                </tbody>
              </table>
            </div>
          `;

          container.appendChild(section);
        }

        allRows = Array.from(document.querySelectorAll('.data-row'));

        enableSorting();

      } catch (error) {
        container.innerHTML = `<p class="no-results">Failed to load data: ${error.message}</p>`;
        console.error(error);
      }
    }

    function filterData() {
      const term = normalize(document.getElementById('searchInput').value);
      if (!term) {
        allRows.forEach(row => (row.style.display = ''));
        document.querySelectorAll('section.center-group').forEach(s => (s.style.display = ''));
        const msg = document.querySelector('.no-results-message');
        if (msg) msg.remove();
        return;
      }

      let anyVisible = false;

      allRows.forEach(row => {
        const match = row.dataset.search.includes(term);
        row.style.display = match ? '' : 'none';
        if (match) anyVisible = true;
      });

      document.querySelectorAll('section.center-group').forEach(section => {
        const visibleRows = section.querySelectorAll('tbody tr:not([style*="display: none"])');
        section.style.display = visibleRows.length ? '' : 'none';
      });

      const container = document.getElementById('directoryContainer');
      if (!anyVisible && !document.querySelector('.no-results-message')) {
        const msg = document.createElement('p');
        msg.className = 'no-results no-results-message';
        msg.textContent = 'No matching contacts found.';
        container.appendChild(msg);
      } else if (anyVisible) {
        const msg = document.querySelector('.no-results-message');
        if (msg) msg.remove();
      }
    }

    function enableSorting() {
      const tables = document.querySelectorAll('table.sortable-table');
      tables.forEach(table => {
        const headers = table.querySelectorAll('thead th');
        headers.forEach(th => {
          th.addEventListener('click', () => {
            const colIndex = parseInt(th.getAttribute('data-col'));
            const tbody = table.querySelector('tbody');
            const rowsArray = Array.from(tbody.querySelectorAll('tr'));

            // Determine current sort direction
            let currentSort = th.getAttribute('data-sort') || 'none';
            // Reset sort on other headers
            headers.forEach(h => {
              if (h !== th) {
                h.setAttribute('data-sort', 'none');
                h.querySelector('.sort-arrow').textContent = '';
              }
            });

            // Toggle sort direction
            let newSort;
            if (currentSort === 'none' || currentSort === 'desc') newSort = 'asc';
            else newSort = 'desc';

            th.setAttribute('data-sort', newSort);
            th.querySelector('.sort-arrow').textContent = newSort === 'asc' ? '▲' : '▼';

            rowsArray.sort((a, b) => {
              let aText = a.children[colIndex].textContent.trim().toLowerCase();
              let bText = b.children[colIndex].textContent.trim().toLowerCase();

              // Special case: phone column (col 0) — compare numerically ignoring non-digits
              if (colIndex === 0) {
                aText = aText.replace(/\D/g, '') || '0';
                bText = bText.replace(/\D/g, '') || '0';
                return newSort === 'asc' ? aText.localeCompare(bText, undefined, {numeric: true}) : bText.localeCompare(aText, undefined, {numeric: true});
              }

              // Default string comparison
              if (aText < bText) return newSort === 'asc' ? -1 : 1;
              if (aText > bText) return newSort === 'asc' ? 1 : -1;
              return 0;
            });

            // Append sorted rows
            rowsArray.forEach(row => tbody.appendChild(row));
          });
        });
      });
    }

    document.getElementById('searchInput').addEventListener('input', filterData);

    window.onload = loadData;
  </script>
