package com.mycompany.fretes.repository;

import com.mycompany.fretes.domain.Caminhao;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Caminhao entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CaminhaoRepository extends JpaRepository<Caminhao, Long> {}
