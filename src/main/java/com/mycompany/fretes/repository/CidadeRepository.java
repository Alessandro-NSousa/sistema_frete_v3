package com.mycompany.fretes.repository;

import com.mycompany.fretes.domain.Cidade;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Cidade entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CidadeRepository extends JpaRepository<Cidade, Long> {}
