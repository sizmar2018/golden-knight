
public class Utilisateur {
  
	
	public String email;
	public String pseudo;
	public String motDePasse;
	public int score;
	public int id;
	//private static int nbr_util = 1;

	public Utilisateur() {
	};

	public Utilisateur(int id ,String pseudo, String email, String motDePasse) {
		this.email = email;
		this.pseudo = pseudo;
		this.motDePasse = motDePasse;
		this.score = 0;
		this.id = id;
	
	}
	
	
	
	
	
	
	
}
