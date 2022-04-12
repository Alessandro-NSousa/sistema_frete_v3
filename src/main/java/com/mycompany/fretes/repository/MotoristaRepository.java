package com.mycompany.fretes.repository;

import com.mycompany.fretes.domain.Motorista;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Motorista entity.
 */
@Repository
public interface MotoristaRepository extends JpaRepository<Motorista, Long> {
    default Optional<Motorista> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Motorista> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Motorista> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct motorista from Motorista motorista left join fetch motorista.endereco",
        countQuery = "select count(distinct motorista) from Motorista motorista"
    )
    Page<Motorista> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct motorista from Motorista motorista left join fetch motorista.endereco")
    List<Motorista> findAllWithToOneRelationships();

    @Query("select motorista from Motorista motorista left join fetch motorista.endereco where motorista.id =:id")
    Optional<Motorista> findOneWithToOneRelationships(@Param("id") Long id);
}
