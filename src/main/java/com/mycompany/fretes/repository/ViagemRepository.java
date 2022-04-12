package com.mycompany.fretes.repository;

import com.mycompany.fretes.domain.Viagem;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Viagem entity.
 */
@Repository
public interface ViagemRepository extends JpaRepository<Viagem, Long> {
    default Optional<Viagem> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Viagem> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Viagem> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct viagem from Viagem viagem left join fetch viagem.frete left join fetch viagem.dispesa",
        countQuery = "select count(distinct viagem) from Viagem viagem"
    )
    Page<Viagem> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct viagem from Viagem viagem left join fetch viagem.frete left join fetch viagem.dispesa")
    List<Viagem> findAllWithToOneRelationships();

    @Query("select viagem from Viagem viagem left join fetch viagem.frete left join fetch viagem.dispesa where viagem.id =:id")
    Optional<Viagem> findOneWithToOneRelationships(@Param("id") Long id);
}
