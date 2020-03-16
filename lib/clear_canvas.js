$(function () {
  var canvas = $('#canvasElement');
  var context = canvas.get(0).getContext('2d');
  var canvasWidth = canvas.width();
  var canvasHeight = canvas.height();
  var x = 10;
  var y = 10;

  function moveBox() {
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    context.fillRect(x, y, 10, 10);
    x++;
    setTimeout(moveBox, 33);
  }

  moveBox();
});
