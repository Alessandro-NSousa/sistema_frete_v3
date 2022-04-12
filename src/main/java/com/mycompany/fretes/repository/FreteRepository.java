package com.mycompany.fretes.repository;

import com.mycompany.fretes.domain.Frete;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Frete entity.
 */
@Repository
public interface FreteRepository extends JpaRepository<Frete, Long> {
    default Optional<Frete> findOneWithEagerRelationships(Long id) {
        return this.findOneWithToOneRelationships(id);
    }

    default List<Frete> findAllWithEagerRelationships() {
        return this.findAllWithToOneRelationships();
    }

    default Page<Frete> findAllWithEagerRelationships(Pageable pageable) {
        return this.findAllWithToOneRelationships(pageable);
    }

    @Query(
        value = "select distinct frete from Frete frete left join fetch frete.cidade left join fetch frete.cliente left join fetch frete.motorista left join fetch frete.caminhao",
        countQuery = "select count(distinct frete) from Frete frete"
    )
    Page<Frete> findAllWithToOneRelationships(Pageable pageable);

    @Query(
        "select distinct frete from Frete frete left join fetch frete.cidade left join fetch frete.cliente left join fetch frete.motorista left join fetch frete.caminhao"
    )
    List<Frete> findAllWithToOneRelationships();

    @Query(
        "select frete from Frete frete left join fetch frete.cidade left join fetch frete.cliente left join fetch frete.motorista left join fetch frete.caminhao where frete.id =:id"
    )
    Optional<Frete> findOneWithToOneRelationships(@Param("id") Long id);
}
