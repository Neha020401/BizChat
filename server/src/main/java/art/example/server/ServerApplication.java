package art.example.server;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ServerApplication {

	@Value("${spring.data.mongodb.uri}")
	private String mongoUri;

	@PostConstruct
	public void printMongoUri() {
		System.out.println(">>> Mongo URI = " + mongoUri);
	}

	public static void main(String[] args) {
		SpringApplication.run(ServerApplication.class, args);
	}

}
