package com.mycompany.fretes.web.rest;

import com.mycompany.fretes.domain.Despesa;
import com.mycompany.fretes.repository.DespesaRepository;
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
 * REST controller for managing {@link com.mycompany.fretes.domain.Despesa}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class DespesaResource {

    private final Logger log = LoggerFactory.getLogger(DespesaResource.class);

    private static final String ENTITY_NAME = "despesa";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DespesaRepository despesaRepository;

    public DespesaResource(DespesaRepository despesaRepository) {
        this.despesaRepository = despesaRepository;
    }

    /**
     * {@code POST  /despesas} : Create a new despesa.
     *
     * @param despesa the despesa to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new despesa, or with status {@code 400 (Bad Request)} if the despesa has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/despesas")
    public ResponseEntity<Despesa> createDespesa(@Valid @RequestBody Despesa despesa) throws URISyntaxException {
        log.debug("REST request to save Despesa : {}", despesa);
        if (despesa.getId() != null) {
            throw new BadRequestAlertException("A new despesa cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Despesa result = despesaRepository.save(despesa);
        return ResponseEntity
            .created(new URI("/api/despesas/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /despesas/:id} : Updates an existing despesa.
     *
     * @param id the id of the despesa to save.
     * @param despesa the despesa to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated despesa,
     * or with status {@code 400 (Bad Request)} if the despesa is not valid,
     * or with status {@code 500 (Internal Server Error)} if the despesa couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/despesas/{id}")
    public ResponseEntity<Despesa> updateDespesa(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Despesa despesa
    ) throws URISyntaxException {
        log.debug("REST request to update Despesa : {}, {}", id, despesa);
        if (despesa.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, despesa.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!despesaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Despesa result = despesaRepository.save(despesa);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, despesa.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /despesas/:id} : Partial updates given fields of an existing despesa, field will ignore if it is null
     *
     * @param id the id of the despesa to save.
     * @param despesa the despesa to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated despesa,
     * or with status {@code 400 (Bad Request)} if the despesa is not valid,
     * or with status {@code 404 (Not Found)} if the despesa is not found,
     * or with status {@code 500 (Internal Server Error)} if the despesa couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/despesas/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Despesa> partialUpdateDespesa(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Despesa despesa
    ) throws URISyntaxException {
        log.debug("REST request to partial update Despesa partially : {}, {}", id, despesa);
        if (despesa.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, despesa.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!despesaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Despesa> result = despesaRepository
            .findById(despesa.getId())
            .map(existingDespesa -> {
                if (despesa.getDescricao() != null) {
                    existingDespesa.setDescricao(despesa.getDescricao());
                }

                return existingDespesa;
            })
            .map(despesaRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, despesa.getId().toString())
        );
    }

    /**
     * {@code GET  /despesas} : get all the despesas.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of despesas in body.
     */
    @GetMapping("/despesas")
    public List<Despesa> getAllDespesas() {
        log.debug("REST request to get all Despesas");
        return despesaRepository.findAll();
    }

    /**
     * {@code GET  /despesas/:id} : get the "id" despesa.
     *
     * @param id the id of the despesa to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the despesa, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/despesas/{id}")
    public ResponseEntity<Despesa> getDespesa(@PathVariable Long id) {
        log.debug("REST request to get Despesa : {}", id);
        Optional<Despesa> despesa = despesaRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(despesa);
    }

    /**
     * {@code DELETE  /despesas/:id} : delete the "id" despesa.
     *
     * @param id the id of the despesa to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/despesas/{id}")
    public ResponseEntity<Void> deleteDespesa(@PathVariable Long id) {
        log.debug("REST request to delete Despesa : {}", id);
        despesaRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
