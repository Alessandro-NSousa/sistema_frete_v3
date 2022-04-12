package com.mycompany.fretes.web.rest;

import com.mycompany.fretes.domain.Caminhao;
import com.mycompany.fretes.repository.CaminhaoRepository;
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
 * REST controller for managing {@link com.mycompany.fretes.domain.Caminhao}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CaminhaoResource {

    private final Logger log = LoggerFactory.getLogger(CaminhaoResource.class);

    private static final String ENTITY_NAME = "caminhao";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CaminhaoRepository caminhaoRepository;

    public CaminhaoResource(CaminhaoRepository caminhaoRepository) {
        this.caminhaoRepository = caminhaoRepository;
    }

    /**
     * {@code POST  /caminhaos} : Create a new caminhao.
     *
     * @param caminhao the caminhao to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new caminhao, or with status {@code 400 (Bad Request)} if the caminhao has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/caminhaos")
    public ResponseEntity<Caminhao> createCaminhao(@RequestBody Caminhao caminhao) throws URISyntaxException {
        log.debug("REST request to save Caminhao : {}", caminhao);
        if (caminhao.getId() != null) {
            throw new BadRequestAlertException("A new caminhao cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Caminhao result = caminhaoRepository.save(caminhao);
        return ResponseEntity
            .created(new URI("/api/caminhaos/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /caminhaos/:id} : Updates an existing caminhao.
     *
     * @param id the id of the caminhao to save.
     * @param caminhao the caminhao to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated caminhao,
     * or with status {@code 400 (Bad Request)} if the caminhao is not valid,
     * or with status {@code 500 (Internal Server Error)} if the caminhao couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/caminhaos/{id}")
    public ResponseEntity<Caminhao> updateCaminhao(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Caminhao caminhao
    ) throws URISyntaxException {
        log.debug("REST request to update Caminhao : {}, {}", id, caminhao);
        if (caminhao.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, caminhao.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!caminhaoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Caminhao result = caminhaoRepository.save(caminhao);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, caminhao.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /caminhaos/:id} : Partial updates given fields of an existing caminhao, field will ignore if it is null
     *
     * @param id the id of the caminhao to save.
     * @param caminhao the caminhao to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated caminhao,
     * or with status {@code 400 (Bad Request)} if the caminhao is not valid,
     * or with status {@code 404 (Not Found)} if the caminhao is not found,
     * or with status {@code 500 (Internal Server Error)} if the caminhao couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/caminhaos/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Caminhao> partialUpdateCaminhao(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Caminhao caminhao
    ) throws URISyntaxException {
        log.debug("REST request to partial update Caminhao partially : {}, {}", id, caminhao);
        if (caminhao.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, caminhao.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!caminhaoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Caminhao> result = caminhaoRepository
            .findById(caminhao.getId())
            .map(existingCaminhao -> {
                if (caminhao.getPlaca() != null) {
                    existingCaminhao.setPlaca(caminhao.getPlaca());
                }
                if (caminhao.getAno() != null) {
                    existingCaminhao.setAno(caminhao.getAno());
                }
                if (caminhao.getMarca() != null) {
                    existingCaminhao.setMarca(caminhao.getMarca());
                }
                if (caminhao.getCarga() != null) {
                    existingCaminhao.setCarga(caminhao.getCarga());
                }

                return existingCaminhao;
            })
            .map(caminhaoRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, caminhao.getId().toString())
        );
    }

    /**
     * {@code GET  /caminhaos} : get all the caminhaos.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of caminhaos in body.
     */
    @GetMapping("/caminhaos")
    public List<Caminhao> getAllCaminhaos() {
        log.debug("REST request to get all Caminhaos");
        return caminhaoRepository.findAll();
    }

    /**
     * {@code GET  /caminhaos/:id} : get the "id" caminhao.
     *
     * @param id the id of the caminhao to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the caminhao, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/caminhaos/{id}")
    public ResponseEntity<Caminhao> getCaminhao(@PathVariable Long id) {
        log.debug("REST request to get Caminhao : {}", id);
        Optional<Caminhao> caminhao = caminhaoRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(caminhao);
    }

    /**
     * {@code DELETE  /caminhaos/:id} : delete the "id" caminhao.
     *
     * @param id the id of the caminhao to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/caminhaos/{id}")
    public ResponseEntity<Void> deleteCaminhao(@PathVariable Long id) {
        log.debug("REST request to delete Caminhao : {}", id);
        caminhaoRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
