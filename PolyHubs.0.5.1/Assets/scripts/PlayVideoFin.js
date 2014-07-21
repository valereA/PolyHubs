#pragma strict

var movTexturec : MovieTexture;

function Start () {
renderer.material.mainTexture = movTexturec;
		movTexturec.Play();
		movTexturec.loop = true;

}

function Update () {

}