import java.io.BufferedReader;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.auth0.jwt.JWTSigner;
import com.owlike.genson.GenericType;
import com.owlike.genson.Genson;

@SuppressWarnings("serial")
public class InscriptionServlet extends HttpServlet {
	private static final String JWTSECRET = "mybigsecrete123";

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

		try {

			StringBuffer jb = new StringBuffer();
			String line = null;
			try {
				BufferedReader reader = req.getReader();
				while ((line = reader.readLine()) != null) {
					jb.append(line);
				}
			} catch (Exception e) {
				e.printStackTrace();
			}

			Genson genson = new Genson();

			Map<String, Object> map = genson.deserialize(jb.toString(), Map.class);

			System.out.println("je passssssssse");
			String pseudo = map.get("pseudo").toString();
			String motDePasse = map.get("motDePasse").toString();
			String email = map.get("email").toString();

			String json = new String(Files.readAllBytes(Paths.get("./donnees/utilisateurs.json")));
			System.out.println("dfgdsdhg : " + json);
			Genson gensonDossier = new Genson();
			List<Utilisateur> utilisateurs = gensonDossier.deserialize(json, new GenericType<List<Utilisateur>>() {
			});
               int id = (utilisateurs.size())+1;
               String sel=BCrypt.gensalt();
				String motDePasseHach = BCrypt.hashpw(motDePasse, sel);
			Utilisateur utilisateur = new Utilisateur(id,pseudo, email, motDePasseHach);
			System.out.println(utilisateur.pseudo);
			boolean dejaPseudo = false;
			for (int i = 0; i < utilisateurs.size(); i++) {
				if (utilisateurs.get(i).pseudo.equals(utilisateur.pseudo)) {
					System.out.println("gff,hg");
					json = "{\"success\":\"false\", \"error\":\"pseudo deja utilise.\"}";
					resp.setContentType("application/json");
					resp.setCharacterEncoding("UTF-8");
					resp.setStatus(HttpServletResponse.SC_OK);
					resp.getWriter().write(json);
					dejaPseudo = true;
					break;
				}
			}

			int id_user = 0;
			System.out.println(dejaPseudo);
			if (dejaPseudo == false) {
				System.out.println("gff,hg");
				utilisateurs.add(utilisateur);
				id_user = utilisateur.id;
				json = genson.serialize(utilisateurs);

				Files.write(Paths.get("./donnees/utilisateurs.json"), json.getBytes());

				Map<String, Object> claims = new HashMap<String, Object>();
				claims.put("id", UUID.randomUUID().toString());
				String adresse = id_user + "/" + req.getRemoteAddr();
				System.out.println("adresse");
				claims.put("ip", adresse);
				String token = new JWTSigner(JWTSECRET).sign(claims);
				System.out.println(token);
				json = "{\"success\":\"true\", \"token\":\"" + token + "\"}";
				resp.setContentType("application/json");
				resp.setCharacterEncoding("UTF-8");
				resp.setStatus(HttpServletResponse.SC_OK);
				resp.getWriter().write(json);
			}
		} catch (Exception e) {
			e.printStackTrace();
			String json = "{\"success\":\"false\", \"error\":";
			json += e.getMessage();
			json += "}";
			resp.setContentType("application/json");
			resp.setCharacterEncoding("UTF-8");
			resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			resp.getWriter().write(json);
		}
	}

}
