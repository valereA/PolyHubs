
var movTexturea : MovieTexture;
	
	function Start () {
		renderer.material.mainTexture = movTexturea;
		movTexturea.Play();
		movTexturea.loop = true;
	}
	
		function Update () {
		}