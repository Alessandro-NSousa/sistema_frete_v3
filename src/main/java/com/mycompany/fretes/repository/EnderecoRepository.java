package com.mycompany.fretes.repository;

import com.mycompany.fretes.domain.Endereco;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Endereco entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EnderecoRepository extends JpaRepository<Endereco, Long> {}
