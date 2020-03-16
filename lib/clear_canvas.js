$(function() {
var canvas = $('#canvasElement');
var context = canvas.get(0).getContext('2d');
var canvasWidth = canvas.width();
var canvasHeight = canvas.height();
var x = 10;
var y = 10;
function moveBox() {
// Очищаем наш холст для перерисовки
context.clearRect(0,0, canvasWidth, canvasHeight);
// Рисуем наш квадратик
context.fillRect(x, y, 10, 10);
// Увеличиваем x при каждом обращении к этой функции на еденицу
// Тем самым заставляем двигаться квадрат по прямой
x++;
// В цикле каждые 33 миллисекунды вызываем moveBox()
setTimeout(moveBox, 33);
}
// Старт
moveBox();
}); 