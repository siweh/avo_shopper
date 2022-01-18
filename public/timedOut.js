document.addEventListener('DOMContentLoaded', function () {
  successElem = document.querySelector('.success');
  errorElem = document.querySelector('.error');

  if (successElem.innerHTML !== '' || errorElem.innerHTML !== '') {
    setTimeout(function () {
      successElem.innerHTML = '';
      errorElem.innerHTML = '';
    }, 3000);
  }
});
