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
import com.auth0.jwt.JWTVerifier;
import com.owlike.genson.GenericType;
import com.owlike.genson.Genson;

@SuppressWarnings("serial")
public class ConnexionServlet extends HttpServlet {
	private static final String JWTSECRET = "mybigsecrete123";

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		try {
			StringBuffer jb = new StringBuffer();
			String line = null;
			try {
				BufferedReader reader = req.getReader();
				while ((line = reader.readLine()) != null)
					jb.append(line);
			} catch (Exception e) {
				e.printStackTrace();
			}

			Genson genson = new Genson();
			Map<String, Object> map = genson.deserialize(jb.toString(), Map.class);
			String pseudo = map.get("pseudo").toString();
			String motDePasse = map.get("motDePasse").toString();
			System.out.println(motDePasse);
			String json = new String(Files.readAllBytes(Paths.get("./donnees/utilisateurs.json")));
			Genson gensonDossier = new Genson();
			List<Utilisateur> utilisateurs = gensonDossier.deserialize(json, new GenericType<List<Utilisateur>>() {
			});

			// Utilisateur utilisateur = new Utilisateur(pseudo, motDePasse, email);
			boolean isValide = false;
			for (int i = 0; i < utilisateurs.size(); i++) {
				if (BCrypt.checkpw(motDePasse,utilisateurs.get(i).motDePasse)&& utilisateurs.get(i).pseudo.equals(pseudo)) {
					Map<String, Object> claims = new HashMap<String, Object>();
					claims.put("id", UUID.randomUUID().toString());
					int id_user = utilisateurs.get(i).id;
					String adresse = id_user + "/" + req.getRemoteAddr();
					System.out.println("dfbfd" + adresse);
					claims.put("ip", adresse);
					String ltoken = new JWTSigner(JWTSECRET).sign(claims);

					json = "{\"success\":\"true\", \"token\":\"" + ltoken + "\"}";
					resp.setContentType("application/json");
					resp.setCharacterEncoding("UTF-8");
					resp.setStatus(HttpServletResponse.SC_OK);
					resp.getWriter().write(json);
					isValide = true;
					break;
				}
			}
			if (!isValide) {
				json = "{\"success\":\"false\", \"error\":\"Wrong pseudo or password.\"}";
				System.out.println("Authentication error:" + json);
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
