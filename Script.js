var button1 = document.getElementById("clickme"),
  count = 0;
button1.onclick = function() {
  count++;
  button.innerHTML = "Click me: " + count;
  alert("Der Knopf wurde gedrückt")
};
var button2 = document.getElementById("clickme2"),
  count = 0;
button2.onclick = function() {
  --count;
  button.innerHTML = "Click me: " + count;
};
var button = document.getElementById("clickme3"),
    count = 0;
button.onclick = function() {
  --count;
  button.innerHTML = "Warenkorb " + count;
};
