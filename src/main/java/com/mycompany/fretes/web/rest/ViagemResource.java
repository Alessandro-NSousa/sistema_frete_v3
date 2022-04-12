package com.mycompany.fretes.web.rest;

import com.mycompany.fretes.domain.Viagem;
import com.mycompany.fretes.repository.ViagemRepository;
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
 * REST controller for managing {@link com.mycompany.fretes.domain.Viagem}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class ViagemResource {

    private final Logger log = LoggerFactory.getLogger(ViagemResource.class);

    private static final String ENTITY_NAME = "viagem";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ViagemRepository viagemRepository;

    public ViagemResource(ViagemRepository viagemRepository) {
        this.viagemRepository = viagemRepository;
    }

    /**
     * {@code POST  /viagems} : Create a new viagem.
     *
     * @param viagem the viagem to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new viagem, or with status {@code 400 (Bad Request)} if the viagem has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/viagems")
    public ResponseEntity<Viagem> createViagem(@Valid @RequestBody Viagem viagem) throws URISyntaxException {
        log.debug("REST request to save Viagem : {}", viagem);
        if (viagem.getId() != null) {
            throw new BadRequestAlertException("A new viagem cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Viagem result = viagemRepository.save(viagem);
        return ResponseEntity
            .created(new URI("/api/viagems/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /viagems/:id} : Updates an existing viagem.
     *
     * @param id the id of the viagem to save.
     * @param viagem the viagem to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated viagem,
     * or with status {@code 400 (Bad Request)} if the viagem is not valid,
     * or with status {@code 500 (Internal Server Error)} if the viagem couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/viagems/{id}")
    public ResponseEntity<Viagem> updateViagem(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Viagem viagem
    ) throws URISyntaxException {
        log.debug("REST request to update Viagem : {}, {}", id, viagem);
        if (viagem.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, viagem.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!viagemRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Viagem result = viagemRepository.save(viagem);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, viagem.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /viagems/:id} : Partial updates given fields of an existing viagem, field will ignore if it is null
     *
     * @param id the id of the viagem to save.
     * @param viagem the viagem to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated viagem,
     * or with status {@code 400 (Bad Request)} if the viagem is not valid,
     * or with status {@code 404 (Not Found)} if the viagem is not found,
     * or with status {@code 500 (Internal Server Error)} if the viagem couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/viagems/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Viagem> partialUpdateViagem(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Viagem viagem
    ) throws URISyntaxException {
        log.debug("REST request to partial update Viagem partially : {}, {}", id, viagem);
        if (viagem.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, viagem.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!viagemRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Viagem> result = viagemRepository
            .findById(viagem.getId())
            .map(existingViagem -> {
                if (viagem.getValorDespesa() != null) {
                    existingViagem.setValorDespesa(viagem.getValorDespesa());
                }

                return existingViagem;
            })
            .map(viagemRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, viagem.getId().toString())
        );
    }

    /**
     * {@code GET  /viagems} : get all the viagems.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of viagems in body.
     */
    @GetMapping("/viagems")
    public List<Viagem> getAllViagems(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Viagems");
        return viagemRepository.findAllWithEagerRelationships();
    }

    /**
     * {@code GET  /viagems/:id} : get the "id" viagem.
     *
     * @param id the id of the viagem to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the viagem, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/viagems/{id}")
    public ResponseEntity<Viagem> getViagem(@PathVariable Long id) {
        log.debug("REST request to get Viagem : {}", id);
        Optional<Viagem> viagem = viagemRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(viagem);
    }

    /**
     * {@code DELETE  /viagems/:id} : delete the "id" viagem.
     *
     * @param id the id of the viagem to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/viagems/{id}")
    public ResponseEntity<Void> deleteViagem(@PathVariable Long id) {
        log.debug("REST request to delete Viagem : {}", id);
        viagemRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
