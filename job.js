const applicationForm = document.querySelector('#job-application');
const applicationStatus = document.querySelector('#job-form-status');

if (applicationForm && applicationStatus) {
  applicationForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!applicationForm.reportValidity()) return;
    applicationStatus.hidden = false;
  });
}
