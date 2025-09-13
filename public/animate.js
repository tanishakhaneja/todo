// Animate delete: add 'removing' class before form submit

document.addEventListener('DOMContentLoaded', function () {
  // Animate delete
  document.querySelectorAll('form[onsubmit] button[type="submit"]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      var li = btn.closest('.todo-item');
      if (li) {
        li.classList.add('removing');
        // Delay form submit to allow animation
        setTimeout(function () {
          btn.form.submit();
        }, 350);
        e.preventDefault();
      }
    });
  });

  // Highlight edit form if editing
  var todoForm = document.getElementById('todoForm');
  if (todoForm && document.querySelector('input[name="task"][value]') && todoForm.action.includes('_method=PUT')) {
    todoForm.classList.add('editing');
  }
}); 