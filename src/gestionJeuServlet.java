
import java.io.BufferedReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.auth0.jwt.JWTVerifier;
import com.owlike.genson.GenericType;
import com.owlike.genson.Genson;

@SuppressWarnings("serial")
public class GestionJeuServlet extends HttpServlet {
	private static final String JWTSECRET = "mybigsecrete123";

	protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

		try {

			String token = req.getHeader("Authorization");

			if (token != null) {
				token = token.replace("Bearer", "");
				Object userID = null;
				Map<String, Object> decoder = new JWTVerifier(JWTSECRET).verify(token);
				userID = decoder.get("id");
				String id_de_user = decoder.get("ip").toString();
				System.out.println(id_de_user);
				String[] tab = id_de_user.split("/");
				int id_final = Integer.parseInt(tab[0]);
				if (userID != null) {
					/// comment obtenir l'id
					Path path = Paths.get("./donnees/utilisateurs.json");
					Genson genson = new Genson();

					List<Utilisateur> users;
					String json;

					if (Files.exists(path)) {

						json = new String(Files.readAllBytes(Paths.get("./donnees/utilisateurs.json")));
						users = genson.deserialize(json, new GenericType<List<Utilisateur>>() {
						});

						for (Utilisateur utilisateur : users) {
							if (utilisateur.id == id_final) {
								System.out.println("l'id a update est le : " + utilisateur.id);
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

								Genson gen = new Genson();
								Map<String, Object> map = gen.deserialize(jb.toString(), Map.class);
								int score = Integer.parseInt(map.get("score").toString());
								if (score > utilisateur.score) {
									utilisateur.score = score;
								}

								json = gen.serialize(users);
								Files.write(path, json.getBytes());
								json = "{\"success\":\"true\"}";
								resp.setContentType("application/json");
								resp.setCharacterEncoding("UTF-8");
								resp.setStatus(HttpServletResponse.SC_OK);
								resp.getWriter().write(json);
								break;

							}
						}

					} else {
						// le fichier n'existe pas
						System.out.println("probleme fichier ");
						json = "{\"success\":\"false\", \"error\":\"No data on server could be found.\"";
						resp.setContentType("application/json");
						resp.setCharacterEncoding("UTF-8");
						resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
						resp.getWriter().write(json);
					}

				}

			} else {
				// pas un token
				System.out.println("Unvalid or no token provided.");
				String json = "{\"success\":\"false\", \"error\":\"Unauthorized: this ressource can only be accessed with a valid token.\"";
				resp.setContentType("application/json");
				resp.setCharacterEncoding("UTF-8");
				resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
				resp.getWriter().write(json);
			}

		} catch (Exception e) {
			e.printStackTrace();
			resp.setStatus(500);
			resp.setContentType("text/html");
			byte[] msgBytes = e.getMessage().getBytes("UTF-8");
			resp.setContentLength(msgBytes.length);
			resp.setCharacterEncoding("utf-8");
			resp.getOutputStream().write(msgBytes);
		}

	}





	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		try {
			String token = req.getHeader("Authorization");
			if (token != null) {
				token = token.replace("Bearer", "");
				Object userID = null;
				Object ip = null;
				Map<String, Object> decoder = new JWTVerifier(JWTSECRET).verify(token);
				userID = decoder.get("id");
				ip = decoder.get("ip");
				if (userID != null) {
					String json = "{\"success\":\"true\", \"data\":";
					Path path = Paths.get("./donnees/utilisateurs.json");
					if (Files.exists(path)){
						json += new String(Files.readAllBytes(Paths.get("./donnees/utilisateurs.json")));
					}else{
						json += "\"\"";
					}
					json += "}";
					resp.setContentType("application/json");
					resp.setCharacterEncoding("UTF-8");
					resp.setStatus(HttpServletResponse.SC_OK);
					resp.getWriter().write(json);
				}
			} else {
				System.out.println("Unvalid or no token provided.");
				String json = "{\"success\":\"false\", \"error\":\"Unauthorized: this ressource can only be accessed with a valid token.\"}";
				resp.setContentType("application/json");
				resp.setCharacterEncoding("UTF-8");
				resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
				resp.getWriter().write(json);
			}
		}

		catch (Exception e) {
			e.printStackTrace();
			// resp.setStatus(500);
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
