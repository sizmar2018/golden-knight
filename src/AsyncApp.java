import javax.servlet.http.HttpServlet;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.ServletHolder;
import org.eclipse.jetty.webapp.WebAppContext;

public class AsyncApp{
	public static void main(String[] args) throws Exception{
		Server server = new Server(8080);
		WebAppContext context = new WebAppContext();
		context.setContextPath("/");
		context.setInitParameter("cacheControl", "no-store,no-cache,must-revalidate");
		
		HttpServlet inscriptionServlet = new InscriptionServlet();
		context.addServlet(new ServletHolder(inscriptionServlet), "/inscription");
		
		HttpServlet connexionServlet = new ConnexionServlet();
		context.addServlet(new ServletHolder(connexionServlet), "/connexion");
		
		HttpServlet GestionJeuServlet = new GestionJeuServlet();
		context.addServlet(new ServletHolder(GestionJeuServlet),"/jeu");
		//HttpServlet rootServlet = new RootServlet();
		//context.addServlet(new ServletHolder(rootServlet),"/");
		
		context.setResourceBase("public");
		server.setHandler(context);
		server.start();
	}
}