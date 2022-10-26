<script>
document.getElementsByTagName("BODY")[0].onload = function() {adjustHeader()};
document.getElementsByTagName("BODY")[0].onresize = function() {adjustHeader()};
function adjustHeader() {
  var offset = document.getElementById('headerfix').offsetHeight;
  document.getElementById('scrollpart').style.top = offset +"px";
}
</script>
