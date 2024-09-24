package g55.cs3219.backend.sampleService.repository;

import g55.cs3219.backend.sampleService.model.HelloUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HelloRepository extends JpaRepository<HelloUser, Long> {
}
