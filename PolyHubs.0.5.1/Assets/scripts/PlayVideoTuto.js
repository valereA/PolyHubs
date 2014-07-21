
var movTexturea : MovieTexture;
	
	function Start () {
		movTexturea.Stop();
		renderer.material.mainTexture = movTexturea;		
		movTexturea.Play();
		movTexturea.loop = true;
	}
	
	function Update () {
		
	}