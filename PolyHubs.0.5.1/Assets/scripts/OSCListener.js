#pragma strict
  //--------------------------------------------------------------------------------------------------------------//
 //                                            GOOD GOOD GOOD                                                    //
//--------------------------------------------------------------------------------------------------------------//
//Creative Commons
//Licence Creative Commons Attribution - Pas d’Utilisation Commerciale 4.0 International.
//http://lessons.julien-drochon.net
//2014 - Julien Drochon - ESA Pyrenees - Pau
//Atelier Nouveaux Media

//Script permettant de recevoir les messages OSC envoyes par la Kinect via SimpleKinect :
//http://deecerecords.com/kinect/

//Pour que ce script fonctionne, il faut lier les fichiers :
//OSCListener.js (script), OSC (plugin), et UDPPacket IO (PLugin)
//à la camera principale
	
	
	//declaration des variables
	//private signifie qu'elles n'apparaissent pas dans les composants de
	//l'interface Unity
	private var UDPHost : String = "127.0.0.1"; //Adresse IP de destination des messages OSC sortants
	private var listenerPort : int = 8000; // Port d'entree des messages OSC
	private var broadcastPort : int = 57131; // Port des messages OSC sortants
	private var oscHandler : Osc;
	
	//variables Kinect User1
	private var positionXuser1 : float;
	private var positionYuser1 : float;
	private var positionZuser1 : float;
	private var positionUser1Current : Vector3;
	private var positionXuser2 : float;
	private var positionYuser2 : float;
	private var positionZuser2 : float;
	private var positionUser2Current : Vector3;
	private var user1on: int = 0;
	private var user2on: int = 0;
	
	private var niveauUn : boolean;
	private var niveauDeux : boolean;
	private var niveauTrois : boolean;
	private var niveauQuatre : boolean;
	private var niveauCinq : boolean;
	private var niveauSix : boolean;
	private var niveauSept : boolean;
	private var niveauHuit : boolean;
	private var niveauNeuf : boolean;
		
	var rotationZmap : float = 0;
	var rotationXmap : float = 0;
	
	//declarattion variables GameObject
	private var cubeVariable01:GameObject;
	private var cubeVariable02:GameObject;
	private var cubeVariable03:GameObject;
	private var cubeVariable04:GameObject;
	private var cubeVariable05:GameObject;
	private var cubeVariable06:GameObject;
	private var cubeVariable07:GameObject;
	private var cubeVariable08:GameObject;
	

	
	private var help_01:GameObject;
	private var help_02:GameObject;
	private var help_03:GameObject;
	private var help_04:GameObject;
	private var help_05:GameObject;
	private var help_06:GameObject;
	private var help_07:GameObject;
	private var help_08:GameObject;
	
	private var txt_01:GameObject;
	private var txt_02:GameObject;
	private var txt_03:GameObject;
	private var txt_04:GameObject;
	private var txt_05:GameObject;
	private var txt_06:GameObject;
	private var txt_07:GameObject;
	private var txt_08:GameObject;
	
	private var GUIpasDeJoueur:GameObject;
	private var GUIUnJoueur:GameObject;
	private var GUIUniveauNeuf:GameObject;
	private var GUIniveauSuivant:GameObject;
	
	//
	// -------------------------------------------------------------------------------------------------------------------------------------- //
	//
	
	// variables pour régler les validations au niveau supérieur
	// position Z des joueurs
	// les valeurs correspondent aux distances kinect - usagers dans l'espace réél en millimètres
	// rentrer les valeurs correpondantes
	private var niveau01ValidUser01 : float = 2230;
	private var niveau01ValidUser02 : float = 2730;
	private var niveau02ValidUser01 : float = 4720;
	private var niveau02ValidUser02 : float = 3765;
	private var niveau03ValidUser01 : float = 1810;
	private var niveau03ValidUser02 : float = 3505;
	private var niveau04ValidUser01 : float = 2730;
	private var niveau04ValidUser02 : float = 2730;
	private var niveau05ValidUser01 : float = 2650;
	private var niveau05ValidUser02 : float = 4920;
	private var niveau06ValidUser01 : float = 4100;
	private var niveau06ValidUser02 : float = 4100;
	private var niveau07ValidUser01 : float = 4750;
	private var niveau07ValidUser02 : float = 3300;
	private var niveau08ValidUser01 : float = 1500;
	private var niveau08ValidUser02 : float = 1500;
	
	
	
	var ajustement : float = 150;
	
	var tempsAttente : int = 5;
	
	//
	// -------------------------------------------------------------------------------------------------------------------------------------- //
	//
	
	private var PlanVideoVeille : GameObject;
	private var PlanVideoTuto : GameObject;
	private var PlanVideoTimer : GameObject;
	
	private var validationTempsAttente : boolean;
	
	
	var VideoTutoPlaying : boolean ;
	// -------------------------------------------------------------------------------------------------------------------------------------- //
	//                                                             boucle start
	// -------------------------------------------------------------------------------------------------------------------------------------- //
	
	public function Start () {	//correspond au setup() de Processing
		//initalisation OSC
		var udp : UDPPacketIO = GetComponent("UDPPacketIO");
		udp.init(UDPHost, broadcastPort, listenerPort);
		oscHandler = GetComponent("Osc");
		oscHandler.init(udp);

		//Determine quelle adresse OSC recuperer, ici /CoM/1, et envoi à la fonction de ce script nommee simpleKinectOSCuser1
		oscHandler.SetAddressHandler("/CoM/1", simpleKinectOSCuser1); 
		//Determine quelle adresse OSC recuperer, ici /CoM/numUsers, et envoi à la fonction de ce script nommee simpleKinectOSCnbUsers
		oscHandler.SetAddressHandler("/CoM/2", simpleKinectOSCuser2); 
		//assigner à la variable infonumberUsers le game object s'appelant GUI Text
		GUIpasDeJoueur = GameObject.Find("PanneauPasDeJoueur");
		GUIUnJoueur = GameObject.Find("PanneauUnJoueur");
		PlanVideoVeille = GameObject.Find("PlaneVeille");
		PlanVideoTuto = GameObject.Find("PlaneTuto");
		PlanVideoTimer = GameObject.Find("PlaneTimer");
		
		cubeVariable01 = GameObject.Find("module_01");
		cubeVariable02 = GameObject.Find("module_02");
		cubeVariable03 = GameObject.Find("module_03");
		cubeVariable04 = GameObject.Find("module_04");
		cubeVariable05 = GameObject.Find("module_05");
		cubeVariable06 = GameObject.Find("module_06");
		cubeVariable07 = GameObject.Find("module_07");
		cubeVariable08 = GameObject.Find("module_08");
		
		help_01 = GameObject.Find("help_01");
		help_02 = GameObject.Find("help_02");
		help_03 = GameObject.Find("help_03");
		help_04 = GameObject.Find("help_04");
		help_05 = GameObject.Find("help_05");
		help_06 = GameObject.Find("help_06");
		help_07 = GameObject.Find("help_07");
		help_08 = GameObject.Find("help_08");
		
		
		GUIUniveauNeuf =  GameObject.Find("PanneauNiveauNeuf");
		GUIniveauSuivant = GameObject.Find("PanneauNiveauSuivant");
		
		txt_01 = GameObject.Find("txt_01");
		txt_02 = GameObject.Find("txt_02");
		txt_03 = GameObject.Find("txt_03");
		txt_04 = GameObject.Find("txt_04");
		txt_05 = GameObject.Find("txt_05");
		txt_06 = GameObject.Find("txt_06");
		txt_07 = GameObject.Find("txt_07");
		txt_08 = GameObject.Find("txt_08");
		
		//affichage / masquage des differentes etapes de jeu
		
		GUIUnJoueur.SetActive(false);
		
		cubeVariable01.SetActive(false);
		cubeVariable02.SetActive(false);
		cubeVariable03.SetActive(false);
		cubeVariable04.SetActive(false);
		cubeVariable05.SetActive(false);
		cubeVariable06.SetActive(false);
		cubeVariable07.SetActive(false);
		cubeVariable08.SetActive(false);
		

		
		help_01.SetActive(false);
		help_02.SetActive(false);
		help_03.SetActive(false);
		help_04.SetActive(false);
		help_05.SetActive(false);
		help_06.SetActive(false);
		help_07.SetActive(false);
		help_08.SetActive(false);
		
		txt_01.SetActive(false);
		txt_02.SetActive(false);
		txt_03.SetActive(false);
		txt_04.SetActive(false);
		txt_05.SetActive(false);
		txt_06.SetActive(false);
		txt_07.SetActive(false);
		txt_08.SetActive(false);
		
		PlanVideoVeille.SetActive(false);
		PlanVideoTuto.SetActive(false);
		GUIUniveauNeuf.SetActive(false);
		GUIniveauSuivant.SetActive(false);
		PlanVideoTimer.SetActive(false);
		
	//initalisation niveau de jeu
		niveauUn = true;
		niveauDeux =false;
		niveauTrois=false;
		niveauQuatre=false;
		niveauCinq=false;
		niveauSix=false;
	 	niveauSept=false;
	 	niveauHuit=false;
	 	niveauNeuf=false;
	 	
	 	// valeur booléenne pour le timer
	 	validationTempsAttente = false;
		}
	// -------------------------------------------------------------------------------------------------------------------------------------- //
	//                                                             boucle update
	// -------------------------------------------------------------------------------------------------------------------------------------- //
	
	
	// -------------------------------------------------------------------------------------------------------------------------------------- //
	//                                                             0 joueur
	// -------------------------------------------------------------------------------------------------------------------------------------- //
	
	function Update () {// correspond au draw() de Processing
	// ------------------------------------------------------------- Si pas de joueur	
		if(user1on + user2on == 0)
		{  	
		//affichage / masquage des differentes etapes de jeu en activant / desactivant les gameObjects
		PlanVideoVeille.SetActive(true);
			
		cubeVariable01.SetActive(false);
		cubeVariable02.SetActive(false);
		cubeVariable03.SetActive(false);
		cubeVariable04.SetActive(false);
		cubeVariable05.SetActive(false);
		cubeVariable06.SetActive(false);
		cubeVariable07.SetActive(false);
		cubeVariable08.SetActive(false);
		
		help_01.SetActive(false);
		help_02.SetActive(false);
		help_03.SetActive(false);
		help_04.SetActive(false);
		help_05.SetActive(false);
		help_06.SetActive(false);
		help_07.SetActive(false);
		help_08.SetActive(false);
			
		txt_01.SetActive(false);
		txt_02.SetActive(false);
		txt_03.SetActive(false);
		txt_04.SetActive(false);
		txt_05.SetActive(false);
		txt_06.SetActive(false);
		txt_07.SetActive(false);
		txt_08.SetActive(false);

		PlanVideoTuto.SetActive(false);
		GUIUniveauNeuf.SetActive(false);
		GUIniveauSuivant.SetActive(false);
		PlanVideoTimer.SetActive(false);
			
		}// fin condition if(user1on + user2on == 0)
		
	// -------------------------------------------------------------------------------------------------------------------------------------- //
	//                                                             1 joueur
	// -------------------------------------------------------------------------------------------------------------------------------------- //
	
		else if (user1on + user2on == 1) 
		{ 
		//affichage / masquage des differentes etapes de jeu en activant / desactivant les gameObjects
		cubeVariable01.SetActive(false);
		cubeVariable02.SetActive(false);
		cubeVariable03.SetActive(false);
		cubeVariable04.SetActive(false);
		cubeVariable05.SetActive(false);
		cubeVariable06.SetActive(false);
		cubeVariable07.SetActive(false);
		cubeVariable08.SetActive(false);
		
		help_01.SetActive(false);
		help_02.SetActive(false);
		help_03.SetActive(false);
		help_04.SetActive(false);
		help_05.SetActive(false);
		help_06.SetActive(false);
		help_07.SetActive(false);
		help_08.SetActive(false);
		
		txt_01.SetActive(false);
		txt_02.SetActive(false);
		txt_03.SetActive(false);
		txt_04.SetActive(false);
		txt_05.SetActive(false);
		txt_06.SetActive(false);
		txt_07.SetActive(false);
		txt_08.SetActive(false);

		PlanVideoTuto.SetActive(true);
		GUIUniveauNeuf.SetActive(false);
		GUIniveauSuivant.SetActive(false);
		PlanVideoTimer.SetActive(false);
			
		}// fin condition else if (user1on + user2on == 1) 
		
	// -------------------------------------------------------------------------------------------------------------------------------------- //
	//                                                             2 joueurs
	// -------------------------------------------------------------------------------------------------------------------------------------- //
	
		else if(user1on + user2on == 2)
		{ 
		// ------------------------------------------------------------- | NIVEAU 1 |		
		
		if (niveauUn == true) {

		cubeVariable01.SetActive(true);
		help_01.SetActive(true);
		txt_01.SetActive(true);
			

		GUIUnJoueur.SetActive(false);
		PlanVideoVeille.SetActive(false);
		PlanVideoTuto.SetActive(false);
		PlanVideoTimer.SetActive(false);
			
		rotationXmap = ((positionZuser1)*359)/4000;
		rotationZmap = ((positionZuser2)*359)/4000;
		cubeVariable01.transform.rotation = Quaternion.Euler(Vector3(rotationZmap,594,rotationXmap));

		// ------------------------------------- Conditions de fin de niveau 1
		//---------------------------------------------------------- Si win, alors…
			if( (	positionZuser1 < niveau01ValidUser01 + ajustement 
				&& 	positionZuser1 > niveau01ValidUser01 - ajustement 
				&& 	positionZuser2 < niveau01ValidUser02 + ajustement 
				&& 	positionZuser2 > niveau01ValidUser02 - ajustement) 
				|| 
				(	positionZuser2 < niveau01ValidUser01 + ajustement 
				&& 	positionZuser2 > niveau01ValidUser01 - ajustement 
				&& 	positionZuser1 < niveau01ValidUser02 + ajustement 
				&& 	positionZuser1 > niveau01ValidUser02 - ajustement
				) )
			{	
			Debug.Log("Fin Niveau 1 Valeur Rotation" + "X : " + rotationZmap + "Z : " + rotationXmap);
			validationTempsAttente=false;
			niveauUn = false;
			niveauDeux = true;
			}// fin if conditions de validation de fin de niveau 01
		}// fin if (niveauUn == true)
		
		// ------------------------------------------------------------- | NIVEAU 2 |	
		
		if (niveauDeux == true) {
		
		cubeVariable01.SetActive(false);
		help_01.SetActive(false);
		txt_01.SetActive(false);
		//cette condition if / else permet de faire fonctionner le timer correctement
		if(validationTempsAttente==false)
		{
			Attente();
		}
		else
		{
		cubeVariable02.SetActive(true);
		help_02.SetActive(true);
		txt_02.SetActive(true);

		PlanVideoVeille.SetActive(false);
		PlanVideoTuto.SetActive(false);
		PlanVideoTimer.SetActive(false);
			
		rotationXmap = ((positionZuser1)*359)/4000;
		rotationZmap = ((positionZuser2)*359)/4000;
		cubeVariable02.transform.rotation = Quaternion.Euler(Vector3(rotationZmap,594,rotationXmap));
		
		// ------------------------------------- Conditions de fin de niveau 2
		//---------------------------------------------------------- Si win, alors…
			if( (	positionZuser1 < niveau02ValidUser01 + ajustement 
				&& 	positionZuser1 > niveau02ValidUser01 - ajustement 
				&& 	positionZuser2 < niveau02ValidUser02 + ajustement 
				&& 	positionZuser2 > niveau02ValidUser02 - ajustement) 
				|| 
				(	positionZuser2 < niveau02ValidUser01 + ajustement 
				&& 	positionZuser2 > niveau02ValidUser01 - ajustement 
				&& 	positionZuser1 < niveau02ValidUser02 + ajustement 
				&& 	positionZuser1 > niveau02ValidUser02 - ajustement
				) )
			{	
			Debug.Log("Fin Niveau 2 Valeur Rotation" + "X : " + rotationZmap + "Z : " + rotationXmap);
			validationTempsAttente=false;
			niveauDeux = false;
			niveauTrois = true;
			}// if condition de validation de fin de niveau 02
		}//fin else if(validationTempsAttente==false)
		}// fin if (niveauDeux == true)
		
		// ------------------------------------------------------------- | NIVEAU 3 |	
		if (niveauTrois == true) {	
		
		cubeVariable02.SetActive(false);
		help_02.SetActive(false);
		txt_02.SetActive(false);
		//cette condition if / else permet de faire fonctionner le timer correctement
		if(validationTempsAttente==false){
				Attente();
		}else
		{
		cubeVariable03.SetActive(true);
		help_03.SetActive(true);
		txt_03.SetActive(true);
		
		PlanVideoVeille.SetActive(false);
		PlanVideoTuto.SetActive(false);
		PlanVideoTimer.SetActive(false);
			
		
		rotationXmap = ((positionZuser1)*359)/4000;
		rotationZmap = ((positionZuser2)*359)/4000;
		cubeVariable03.transform.rotation = Quaternion.Euler(Vector3(rotationZmap,594,rotationXmap));
		
		// ------------------------------------- Conditions de fin de niveau 3
		//---------------------------------------------------------- Si win, alors…
			if( (	positionZuser1 < niveau03ValidUser01 + ajustement 
				&& 	positionZuser1 > niveau03ValidUser01 - ajustement 
				&& 	positionZuser2 < niveau03ValidUser02 + ajustement 
				&& 	positionZuser2 > niveau03ValidUser02 - ajustement) 
				|| 
				(	positionZuser2 < niveau03ValidUser01 + ajustement 
				&& 	positionZuser2 > niveau03ValidUser01 - ajustement 
				&& 	positionZuser1 < niveau03ValidUser02 + ajustement 
				&& 	positionZuser1 > niveau03ValidUser02 - ajustement
				) )
			{	
			Debug.Log("Fin Niveau 3 Valeur Rotation" + "X : " + rotationZmap + "Z : " + rotationXmap);
			validationTempsAttente=false;
			niveauTrois = false;
			niveauQuatre = true;
			}// if condition de validation de fin de niveau 03
		}//fin else if(validationTempsAttente==false)
		}// fin if (niveauTrois == true)
		// ------------------------------------------------------------- | NIVEAU 4 |	
		if (niveauQuatre == true) {	
		
		cubeVariable03.SetActive(false);
		help_03.SetActive(false);
		txt_03.SetActive(false);
		//cette condition if / else permet de faire fonctionner le timer correctement
		if(validationTempsAttente==false){
				Attente();
		}else
		{
		cubeVariable04.SetActive(true);
		help_04.SetActive(true);
		txt_04.SetActive(true);
		
		PlanVideoVeille.SetActive(false);
		PlanVideoTuto.SetActive(false);
		PlanVideoTimer.SetActive(false);
			
		
		rotationXmap = ((positionZuser1)*359)/4000;
		rotationZmap = ((positionZuser2)*359)/4000;
		cubeVariable04.transform.rotation = Quaternion.Euler(Vector3(rotationZmap,594,rotationXmap));
		
		// ------------------------------------- Conditions de fin de niveau 4
		//---------------------------------------------------------- Si win, alors…
			if( (	positionZuser1 < niveau04ValidUser01 + ajustement 
				&& 	positionZuser1 > niveau04ValidUser01 - ajustement 
				&& 	positionZuser2 < niveau04ValidUser02 + ajustement 
				&& 	positionZuser2 > niveau04ValidUser02 - ajustement) 
				|| 
				(	positionZuser2 < niveau04ValidUser01 + ajustement 
				&& 	positionZuser2 > niveau04ValidUser01 - ajustement 
				&& 	positionZuser1 < niveau04ValidUser02 + ajustement 
				&& 	positionZuser1 > niveau04ValidUser02 - ajustement
				) )
			{	
			Debug.Log("Fin Niveau 4 Valeur Rotation" + "X : " + rotationZmap + "Z : " + rotationXmap);
			validationTempsAttente=false;
			niveauQuatre = false;
			niveauCinq = true;
			}// if condition de validation de fin de niveau 04
		}//fin else if(validationTempsAttente==false)
		}// fin if (niveauQuatre == true)
		// ------------------------------------------------------------- | NIVEAU 5 |	
			if (niveauCinq == true) {	
		
		cubeVariable04.SetActive(false);
		help_04.SetActive(false);
		txt_04.SetActive(false);
		//cette condition if / else permet de faire fonctionner le timer correctement
		if(validationTempsAttente==false){
				Attente();
		}else
		{
		cubeVariable05.SetActive(true);
		help_05.SetActive(true);
		txt_05.SetActive(true);
		
		PlanVideoVeille.SetActive(false);
		PlanVideoTuto.SetActive(false);
		PlanVideoTimer.SetActive(false);
			
		
		rotationXmap = ((positionZuser1)*359)/4000;
		rotationZmap = ((positionZuser2)*359)/4000;
		cubeVariable05.transform.rotation = Quaternion.Euler(Vector3(rotationZmap,594,rotationXmap));
		
		// ------------------------------------- Conditions de fin de niveau 5
		//---------------------------------------------------------- Si win, alors…
			if( (	positionZuser1 < niveau05ValidUser01 + ajustement 
				&& 	positionZuser1 > niveau05ValidUser01 - ajustement 
				&& 	positionZuser2 < niveau05ValidUser02 + ajustement 
				&& 	positionZuser2 > niveau05ValidUser02 - ajustement) 
				|| 
				(	positionZuser2 < niveau05ValidUser01 + ajustement 
				&& 	positionZuser2 > niveau05ValidUser01 - ajustement 
				&& 	positionZuser1 < niveau05ValidUser02 + ajustement 
				&& 	positionZuser1 > niveau05ValidUser02 - ajustement
				) )
			{	
			Debug.Log("Fin Niveau 5 Valeur Rotation" + "X : " + rotationZmap + "Z : " + rotationXmap);
			validationTempsAttente=false;
			niveauCinq = false;
			niveauSix = true;
			}// if condition de validation de fin de niveau 05
		}//fin else if(validationTempsAttente==false)
		}// fin if (niveauCinq == true)
		// ------------------------------------------------------------- | NIVEAU 6 |	
		if (niveauSix == true) {	
		
		cubeVariable05.SetActive(false);
		help_05.SetActive(false);
		txt_05.SetActive(false);
		//cette condition if / else permet de faire fonctionner le timer correctement
		if(validationTempsAttente==false){
				Attente();
		}else
		{
		cubeVariable06.SetActive(true);
		help_06.SetActive(true);
		txt_06.SetActive(true);
	

		PlanVideoVeille.SetActive(false);
		PlanVideoTuto.SetActive(false);
		PlanVideoTimer.SetActive(false);
			
		
		rotationXmap = ((positionZuser1)*359)/4000;
		rotationZmap = ((positionZuser2)*359)/4000;
		cubeVariable06.transform.rotation = Quaternion.Euler(Vector3(rotationZmap,594,rotationXmap));
		
		// ------------------------------------- Conditions de fin de niveau 6
		//---------------------------------------------------------- Si win, alors…
			if( (	positionZuser1 < niveau06ValidUser01 + ajustement 
				&& 	positionZuser1 > niveau06ValidUser01 - ajustement 
				&& 	positionZuser2 < niveau06ValidUser02 + ajustement 
				&& 	positionZuser2 > niveau06ValidUser02 - ajustement) 
				|| 
				(	positionZuser2 < niveau06ValidUser01 + ajustement 
				&& 	positionZuser2 > niveau06ValidUser01 - ajustement 
				&& 	positionZuser1 < niveau06ValidUser02 + ajustement 
				&& 	positionZuser1 > niveau06ValidUser02 - ajustement
				) )
			{	
			Debug.Log("Fin Niveau 6 Valeur Rotation" + "X : " + rotationZmap + "Z : " + rotationXmap);
			validationTempsAttente=false;
			niveauSix = false;
			niveauSept = true;
			}// if condition de validation de fin de niveau 06
		}//fin else if(validationTempsAttente==false)
		}// fin if (niveauSix == true)
		// ------------------------------------------------------------- | NIVEAU 7 |	
		if (niveauSept == true) {	
		
		cubeVariable06.SetActive(false);
		help_06.SetActive(false);
		txt_06.SetActive(false);
		//cette condition if / else permet de faire fonctionner le timer correctement
		if(validationTempsAttente==false){
				Attente();
		}else
		{
		cubeVariable07.SetActive(true);
		help_07.SetActive(true);
		txt_07.SetActive(true);
		
		PlanVideoVeille.SetActive(false);
		PlanVideoTuto.SetActive(false);
		PlanVideoTimer.SetActive(false);
			
		rotationXmap = ((positionZuser1)*359)/4000;
		rotationZmap = ((positionZuser2)*359)/4000;
		cubeVariable07.transform.rotation = Quaternion.Euler(Vector3(rotationZmap,594,rotationXmap));
		
		// ------------------------------------- Conditions de fin de niveau 7
		//---------------------------------------------------------- Si win, alors…
			if( (	positionZuser1 < niveau07ValidUser01 + ajustement 
				&& 	positionZuser1 > niveau07ValidUser01 - ajustement 
				&& 	positionZuser2 < niveau07ValidUser02 + ajustement 
				&& 	positionZuser2 > niveau07ValidUser02 - ajustement) 
				|| 
				(	positionZuser2 < niveau07ValidUser01 + ajustement 
				&& 	positionZuser2 > niveau07ValidUser01 - ajustement 
				&& 	positionZuser1 < niveau07ValidUser02 + ajustement 
				&& 	positionZuser1 > niveau07ValidUser02 - ajustement
				) )
			{	
			Debug.Log("Fin Niveau 7 Valeur Rotation" + "X : " + rotationZmap + "Z : " + rotationXmap);
			validationTempsAttente=false;
			niveauSept = false;
			niveauHuit = true;
			}// if condition de validation de fin de niveau 07
		}//fin else if(validationTempsAttente==false)
		}// fin if (niveauSept == true)
		// ------------------------------------------------------------- | NIVEAU 8 |	
		if (niveauHuit == true) {	
		
		cubeVariable07.SetActive(false);
		help_07.SetActive(false);
		txt_07.SetActive(false);
		//cette condition if / else permet de faire fonctionner le timer correctement
		if(validationTempsAttente==false){
				Attente();
		}else
		{
		cubeVariable08.SetActive(true);
		help_08.SetActive(true);
		txt_08.SetActive(true);
	
		PlanVideoVeille.SetActive(false);
		PlanVideoTuto.SetActive(false);
		PlanVideoTimer.SetActive(false);
			
		
		rotationXmap = ((positionZuser1)*359)/4000;
		rotationZmap = ((positionZuser2)*359)/4000;
		cubeVariable08.transform.rotation = Quaternion.Euler(Vector3(rotationZmap,594,rotationXmap));
		
		// ------------------------------------- Conditions de fin de niveau 8
		//---------------------------------------------------------- Si win, alors…
			if( (	positionZuser1 < niveau08ValidUser01 + ajustement 
				&& 	positionZuser1 > niveau08ValidUser01 - ajustement 
				&& 	positionZuser2 < niveau08ValidUser02 + ajustement 
				&& 	positionZuser2 > niveau08ValidUser02 - ajustement) 
				|| 
				(	positionZuser2 < niveau08ValidUser01 + ajustement 
				&& 	positionZuser2 > niveau08ValidUser01 - ajustement 
				&& 	positionZuser1 < niveau08ValidUser02 + ajustement 
				&& 	positionZuser1 > niveau08ValidUser02 - ajustement
				) )
			{	
			Debug.Log("Fin Niveau 8 Valeur Rotation" + "X : " + rotationZmap + "Z : " + rotationXmap);
			validationTempsAttente=false;
			niveauHuit = false;
			niveauNeuf = true;
			}// if condition de validation de fin de niveau 08
		}//fin else if(validationTempsAttente==false)
		}// fin if else (niveauHuit == true)
		// ------------------------------------------------------------- | NIVEAU 9 |	
		if (niveauNeuf == true) {	
		
		cubeVariable08.SetActive(false);
		help_08.SetActive(false);
		txt_08.SetActive(false);
		
		GUIUniveauNeuf.SetActive(true);
		if(validationTempsAttente==false){
				AttenteNiveauNeuf();
		}else
		{
		validationTempsAttente=false;
		GUIUniveauNeuf.SetActive(false);
		niveauNeuf=false;
		niveauUn = true;
		}//fin else if(validationTempsAttente==false)
		
		
		}// fin if (niveauNeuf == true)
		
	} // fin else if(user1on + user2on == 2)

	}// fin function Update	
	
	
	// -------------------------------------------------------------------------------------------------------------------------------------- //
	//                                               Recuperation des valeurs SImpleKinect
	// -------------------------------------------------------------------------------------------------------------------------------------- //
	 
	public function simpleKinectOSCuser1(oscMessage : OscMessage) : void{	//Fonction permettant de recuperer les messages OSC provenant de "/counterTest"
		
		positionXuser1 = oscMessage.Values[0];
		// assignation à la variable positionYuser1 de la 2e valeur
		//du message /CoM/1
		positionYuser1 = oscMessage.Values[1];
		// assignation à la variable positionZuser1 de la 1ere valeur
		//du message /CoM/1
		positionZuser1 = oscMessage.Values[2];
//	positionZuser2 = oscMessage.Values[2];//**
		
		positionUser1Current = Vector3(oscMessage.Values[0], oscMessage.Values[1], oscMessage.Values[2]);
		//si le message renvoie une valeur, alors user 1 est present
		if (positionUser1Current.x != 0 && positionUser1Current.y != 0  && positionUser1Current.z != 0) 
			{
			user1on = 1;
	//		user2on = 1;//**
			}
			else
			{
			user1on = 0;
	//		user2on = 0;//**
			}
	} 
	
	public function simpleKinectOSCuser2(oscMessage : OscMessage) : void{	//Fonction permettant de recuperer les messages OSC provenant de "/counterTest"
	
		positionXuser2 = oscMessage.Values[0];
		// assignation à la variable positionYuser1 de la 2e valeur
		//du message /CoM/1
		positionYuser2 = oscMessage.Values[1];
		// assignation à la variable positionZuser1 de la 1ere valeur
		//du message /CoM/1
		positionZuser2 = oscMessage.Values[2];
		positionUser2Current = Vector3(oscMessage.Values[0], oscMessage.Values[1], oscMessage.Values[2]);
		if (positionUser2Current.x != 0 && positionUser2Current.y != 0 && positionUser2Current.z != 0) 
			{
			user2on = 1;
			}
			else
			{
			user2on = 0;
			}

}

// -------------------------------------------------------------------------------------------------------------------------------------- //
//                                               Fonction Timer
// -------------------------------------------------------------------------------------------------------------------------------------- //
	 

var Flag: boolean = false;

function Attente(){
//Condition nécessaire pour réinitialiser le temps du timer
if (Flag == false){
Flag = true;
PlanVideoTimer.SetActive(true);
GUIniveauSuivant.SetActive(true);
yield WaitForSeconds (tempsAttente);
PlanVideoTimer.SetActive(false);
GUIniveauSuivant.SetActive(false);
Flag = false;
validationTempsAttente=true;
}
}

var FlagNeuf: boolean = false;

function AttenteNiveauNeuf(){
//Condition nécessaire pour réinitialiser le temps du timer
if (FlagNeuf == false){
FlagNeuf = true;
yield WaitForSeconds (10);
FlagNeuf = false;
validationTempsAttente=true;
}
}

