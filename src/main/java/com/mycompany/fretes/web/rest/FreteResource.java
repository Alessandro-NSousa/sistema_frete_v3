package com.mycompany.fretes.web.rest;

import com.mycompany.fretes.domain.Frete;
import com.mycompany.fretes.repository.FreteRepository;
import com.mycompany.fretes.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.fretes.domain.Frete}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class FreteResource {

    private final Logger log = LoggerFactory.getLogger(FreteResource.class);

    private static final String ENTITY_NAME = "frete";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FreteRepository freteRepository;

    public FreteResource(FreteRepository freteRepository) {
        this.freteRepository = freteRepository;
    }

    /**
     * {@code POST  /fretes} : Create a new frete.
     *
     * @param frete the frete to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new frete, or with status {@code 400 (Bad Request)} if the frete has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/fretes")
    public ResponseEntity<Frete> createFrete(@RequestBody Frete frete) throws URISyntaxException {
        log.debug("REST request to save Frete : {}", frete);
        if (frete.getId() != null) {
            throw new BadRequestAlertException("A new frete cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Frete result = freteRepository.save(frete);
        return ResponseEntity
            .created(new URI("/api/fretes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /fretes/:id} : Updates an existing frete.
     *
     * @param id the id of the frete to save.
     * @param frete the frete to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated frete,
     * or with status {@code 400 (Bad Request)} if the frete is not valid,
     * or with status {@code 500 (Internal Server Error)} if the frete couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/fretes/{id}")
    public ResponseEntity<Frete> updateFrete(@PathVariable(value = "id", required = false) final Long id, @RequestBody Frete frete)
        throws URISyntaxException {
        log.debug("REST request to update Frete : {}, {}", id, frete);
        if (frete.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, frete.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!freteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Frete result = freteRepository.save(frete);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, frete.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /fretes/:id} : Partial updates given fields of an existing frete, field will ignore if it is null
     *
     * @param id the id of the frete to save.
     * @param frete the frete to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated frete,
     * or with status {@code 400 (Bad Request)} if the frete is not valid,
     * or with status {@code 404 (Not Found)} if the frete is not found,
     * or with status {@code 500 (Internal Server Error)} if the frete couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/fretes/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Frete> partialUpdateFrete(@PathVariable(value = "id", required = false) final Long id, @RequestBody Frete frete)
        throws URISyntaxException {
        log.debug("REST request to partial update Frete partially : {}, {}", id, frete);
        if (frete.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, frete.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!freteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Frete> result = freteRepository
            .findById(frete.getId())
            .map(existingFrete -> {
                if (frete.getData() != null) {
                    existingFrete.setData(frete.getData());
                }
                if (frete.getDias() != null) {
                    existingFrete.setDias(frete.getDias());
                }
                if (frete.getValor() != null) {
                    existingFrete.setValor(frete.getValor());
                }
                if (frete.getParcelamento() != null) {
                    existingFrete.setParcelamento(frete.getParcelamento());
                }

                return existingFrete;
            })
            .map(freteRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, frete.getId().toString())
        );
    }

    /**
     * {@code GET  /fretes} : get all the fretes.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of fretes in body.
     */
    @GetMapping("/fretes")
    public List<Frete> getAllFretes(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Fretes");
        return freteRepository.findAllWithEagerRelationships();
    }

    /**
     * {@code GET  /fretes/:id} : get the "id" frete.
     *
     * @param id the id of the frete to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the frete, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/fretes/{id}")
    public ResponseEntity<Frete> getFrete(@PathVariable Long id) {
        log.debug("REST request to get Frete : {}", id);
        Optional<Frete> frete = freteRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(frete);
    }

    /**
     * {@code DELETE  /fretes/:id} : delete the "id" frete.
     *
     * @param id the id of the frete to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/fretes/{id}")
    public ResponseEntity<Void> deleteFrete(@PathVariable Long id) {
        log.debug("REST request to delete Frete : {}", id);
        freteRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
