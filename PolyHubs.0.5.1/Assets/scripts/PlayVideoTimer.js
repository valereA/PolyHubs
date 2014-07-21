	var movTexturea : MovieTexture;

	
	function Start () {
	renderer.material.mainTexture = movTexturea;
	movTexturea.loop = true;
		movTexturea.Play();
	}
	
	function Update () {
//while(movTexturea.isPlaying == false){
//movTexturea.Stop();
//}
}