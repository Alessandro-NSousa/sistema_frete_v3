package com.mycompany.fretes.web.rest;

import com.mycompany.fretes.domain.Motorista;
import com.mycompany.fretes.repository.MotoristaRepository;
import com.mycompany.fretes.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.fretes.domain.Motorista}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class MotoristaResource {

    private final Logger log = LoggerFactory.getLogger(MotoristaResource.class);

    private static final String ENTITY_NAME = "motorista";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MotoristaRepository motoristaRepository;

    public MotoristaResource(MotoristaRepository motoristaRepository) {
        this.motoristaRepository = motoristaRepository;
    }

    /**
     * {@code POST  /motoristas} : Create a new motorista.
     *
     * @param motorista the motorista to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new motorista, or with status {@code 400 (Bad Request)} if the motorista has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/motoristas")
    public ResponseEntity<Motorista> createMotorista(@Valid @RequestBody Motorista motorista) throws URISyntaxException {
        log.debug("REST request to save Motorista : {}", motorista);
        if (motorista.getId() != null) {
            throw new BadRequestAlertException("A new motorista cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Motorista result = motoristaRepository.save(motorista);
        return ResponseEntity
            .created(new URI("/api/motoristas/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /motoristas/:id} : Updates an existing motorista.
     *
     * @param id the id of the motorista to save.
     * @param motorista the motorista to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated motorista,
     * or with status {@code 400 (Bad Request)} if the motorista is not valid,
     * or with status {@code 500 (Internal Server Error)} if the motorista couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/motoristas/{id}")
    public ResponseEntity<Motorista> updateMotorista(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Motorista motorista
    ) throws URISyntaxException {
        log.debug("REST request to update Motorista : {}, {}", id, motorista);
        if (motorista.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, motorista.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!motoristaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Motorista result = motoristaRepository.save(motorista);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, motorista.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /motoristas/:id} : Partial updates given fields of an existing motorista, field will ignore if it is null
     *
     * @param id the id of the motorista to save.
     * @param motorista the motorista to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated motorista,
     * or with status {@code 400 (Bad Request)} if the motorista is not valid,
     * or with status {@code 404 (Not Found)} if the motorista is not found,
     * or with status {@code 500 (Internal Server Error)} if the motorista couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/motoristas/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Motorista> partialUpdateMotorista(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Motorista motorista
    ) throws URISyntaxException {
        log.debug("REST request to partial update Motorista partially : {}, {}", id, motorista);
        if (motorista.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, motorista.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!motoristaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Motorista> result = motoristaRepository
            .findById(motorista.getId())
            .map(existingMotorista -> {
                if (motorista.getNome() != null) {
                    existingMotorista.setNome(motorista.getNome());
                }
                if (motorista.getTelefone() != null) {
                    existingMotorista.setTelefone(motorista.getTelefone());
                }
                if (motorista.getTelefoneAdicional() != null) {
                    existingMotorista.setTelefoneAdicional(motorista.getTelefoneAdicional());
                }
                if (motorista.getCnh() != null) {
                    existingMotorista.setCnh(motorista.getCnh());
                }
                if (motorista.getSexo() != null) {
                    existingMotorista.setSexo(motorista.getSexo());
                }

                return existingMotorista;
            })
            .map(motoristaRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, motorista.getId().toString())
        );
    }

    /**
     * {@code GET  /motoristas} : get all the motoristas.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of motoristas in body.
     */
    @GetMapping("/motoristas")
    public List<Motorista> getAllMotoristas(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Motoristas");
        return motoristaRepository.findAllWithEagerRelationships();
    }

    /**
     * {@code GET  /motoristas/:id} : get the "id" motorista.
     *
     * @param id the id of the motorista to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the motorista, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/motoristas/{id}")
    public ResponseEntity<Motorista> getMotorista(@PathVariable Long id) {
        log.debug("REST request to get Motorista : {}", id);
        Optional<Motorista> motorista = motoristaRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(motorista);
    }

    /**
     * {@code DELETE  /motoristas/:id} : delete the "id" motorista.
     *
     * @param id the id of the motorista to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/motoristas/{id}")
    public ResponseEntity<Void> deleteMotorista(@PathVariable Long id) {
        log.debug("REST request to delete Motorista : {}", id);
        motoristaRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
