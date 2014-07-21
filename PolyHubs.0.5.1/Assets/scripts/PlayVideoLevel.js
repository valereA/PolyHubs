#pragma strict

var movTextureb : MovieTexture;

function Start () {
renderer.material.mainTexture = movTextureb;
		movTextureb.Play();
		movTextureb.loop = true;

}

function Update () {

}