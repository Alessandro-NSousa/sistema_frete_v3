package com.mycompany.fretes.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.fretes.IntegrationTest;
import com.mycompany.fretes.domain.Caminhao;
import com.mycompany.fretes.repository.CaminhaoRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link CaminhaoResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CaminhaoResourceIT {

    private static final String DEFAULT_PLACA = "AAAAAAAAAA";
    private static final String UPDATED_PLACA = "BBBBBBBBBB";

    private static final String DEFAULT_ANO = "AAAAAAAAAA";
    private static final String UPDATED_ANO = "BBBBBBBBBB";

    private static final String DEFAULT_MARCA = "AAAAAAAAAA";
    private static final String UPDATED_MARCA = "BBBBBBBBBB";

    private static final Double DEFAULT_CARGA = 1D;
    private static final Double UPDATED_CARGA = 2D;

    private static final String ENTITY_API_URL = "/api/caminhaos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CaminhaoRepository caminhaoRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCaminhaoMockMvc;

    private Caminhao caminhao;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Caminhao createEntity(EntityManager em) {
        Caminhao caminhao = new Caminhao().placa(DEFAULT_PLACA).ano(DEFAULT_ANO).marca(DEFAULT_MARCA).carga(DEFAULT_CARGA);
        return caminhao;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Caminhao createUpdatedEntity(EntityManager em) {
        Caminhao caminhao = new Caminhao().placa(UPDATED_PLACA).ano(UPDATED_ANO).marca(UPDATED_MARCA).carga(UPDATED_CARGA);
        return caminhao;
    }

    @BeforeEach
    public void initTest() {
        caminhao = createEntity(em);
    }

    @Test
    @Transactional
    void createCaminhao() throws Exception {
        int databaseSizeBeforeCreate = caminhaoRepository.findAll().size();
        // Create the Caminhao
        restCaminhaoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(caminhao)))
            .andExpect(status().isCreated());

        // Validate the Caminhao in the database
        List<Caminhao> caminhaoList = caminhaoRepository.findAll();
        assertThat(caminhaoList).hasSize(databaseSizeBeforeCreate + 1);
        Caminhao testCaminhao = caminhaoList.get(caminhaoList.size() - 1);
        assertThat(testCaminhao.getPlaca()).isEqualTo(DEFAULT_PLACA);
        assertThat(testCaminhao.getAno()).isEqualTo(DEFAULT_ANO);
        assertThat(testCaminhao.getMarca()).isEqualTo(DEFAULT_MARCA);
        assertThat(testCaminhao.getCarga()).isEqualTo(DEFAULT_CARGA);
    }

    @Test
    @Transactional
    void createCaminhaoWithExistingId() throws Exception {
        // Create the Caminhao with an existing ID
        caminhao.setId(1L);

        int databaseSizeBeforeCreate = caminhaoRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCaminhaoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(caminhao)))
            .andExpect(status().isBadRequest());

        // Validate the Caminhao in the database
        List<Caminhao> caminhaoList = caminhaoRepository.findAll();
        assertThat(caminhaoList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCaminhaos() throws Exception {
        // Initialize the database
        caminhaoRepository.saveAndFlush(caminhao);

        // Get all the caminhaoList
        restCaminhaoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(caminhao.getId().intValue())))
            .andExpect(jsonPath("$.[*].placa").value(hasItem(DEFAULT_PLACA)))
            .andExpect(jsonPath("$.[*].ano").value(hasItem(DEFAULT_ANO)))
            .andExpect(jsonPath("$.[*].marca").value(hasItem(DEFAULT_MARCA)))
            .andExpect(jsonPath("$.[*].carga").value(hasItem(DEFAULT_CARGA.doubleValue())));
    }

    @Test
    @Transactional
    void getCaminhao() throws Exception {
        // Initialize the database
        caminhaoRepository.saveAndFlush(caminhao);

        // Get the caminhao
        restCaminhaoMockMvc
            .perform(get(ENTITY_API_URL_ID, caminhao.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(caminhao.getId().intValue()))
            .andExpect(jsonPath("$.placa").value(DEFAULT_PLACA))
            .andExpect(jsonPath("$.ano").value(DEFAULT_ANO))
            .andExpect(jsonPath("$.marca").value(DEFAULT_MARCA))
            .andExpect(jsonPath("$.carga").value(DEFAULT_CARGA.doubleValue()));
    }

    @Test
    @Transactional
    void getNonExistingCaminhao() throws Exception {
        // Get the caminhao
        restCaminhaoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewCaminhao() throws Exception {
        // Initialize the database
        caminhaoRepository.saveAndFlush(caminhao);

        int databaseSizeBeforeUpdate = caminhaoRepository.findAll().size();

        // Update the caminhao
        Caminhao updatedCaminhao = caminhaoRepository.findById(caminhao.getId()).get();
        // Disconnect from session so that the updates on updatedCaminhao are not directly saved in db
        em.detach(updatedCaminhao);
        updatedCaminhao.placa(UPDATED_PLACA).ano(UPDATED_ANO).marca(UPDATED_MARCA).carga(UPDATED_CARGA);

        restCaminhaoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCaminhao.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCaminhao))
            )
            .andExpect(status().isOk());

        // Validate the Caminhao in the database
        List<Caminhao> caminhaoList = caminhaoRepository.findAll();
        assertThat(caminhaoList).hasSize(databaseSizeBeforeUpdate);
        Caminhao testCaminhao = caminhaoList.get(caminhaoList.size() - 1);
        assertThat(testCaminhao.getPlaca()).isEqualTo(UPDATED_PLACA);
        assertThat(testCaminhao.getAno()).isEqualTo(UPDATED_ANO);
        assertThat(testCaminhao.getMarca()).isEqualTo(UPDATED_MARCA);
        assertThat(testCaminhao.getCarga()).isEqualTo(UPDATED_CARGA);
    }

    @Test
    @Transactional
    void putNonExistingCaminhao() throws Exception {
        int databaseSizeBeforeUpdate = caminhaoRepository.findAll().size();
        caminhao.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCaminhaoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, caminhao.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(caminhao))
            )
            .andExpect(status().isBadRequest());

        // Validate the Caminhao in the database
        List<Caminhao> caminhaoList = caminhaoRepository.findAll();
        assertThat(caminhaoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCaminhao() throws Exception {
        int databaseSizeBeforeUpdate = caminhaoRepository.findAll().size();
        caminhao.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCaminhaoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(caminhao))
            )
            .andExpect(status().isBadRequest());

        // Validate the Caminhao in the database
        List<Caminhao> caminhaoList = caminhaoRepository.findAll();
        assertThat(caminhaoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCaminhao() throws Exception {
        int databaseSizeBeforeUpdate = caminhaoRepository.findAll().size();
        caminhao.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCaminhaoMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(caminhao)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Caminhao in the database
        List<Caminhao> caminhaoList = caminhaoRepository.findAll();
        assertThat(caminhaoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCaminhaoWithPatch() throws Exception {
        // Initialize the database
        caminhaoRepository.saveAndFlush(caminhao);

        int databaseSizeBeforeUpdate = caminhaoRepository.findAll().size();

        // Update the caminhao using partial update
        Caminhao partialUpdatedCaminhao = new Caminhao();
        partialUpdatedCaminhao.setId(caminhao.getId());

        partialUpdatedCaminhao.carga(UPDATED_CARGA);

        restCaminhaoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCaminhao.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCaminhao))
            )
            .andExpect(status().isOk());

        // Validate the Caminhao in the database
        List<Caminhao> caminhaoList = caminhaoRepository.findAll();
        assertThat(caminhaoList).hasSize(databaseSizeBeforeUpdate);
        Caminhao testCaminhao = caminhaoList.get(caminhaoList.size() - 1);
        assertThat(testCaminhao.getPlaca()).isEqualTo(DEFAULT_PLACA);
        assertThat(testCaminhao.getAno()).isEqualTo(DEFAULT_ANO);
        assertThat(testCaminhao.getMarca()).isEqualTo(DEFAULT_MARCA);
        assertThat(testCaminhao.getCarga()).isEqualTo(UPDATED_CARGA);
    }

    @Test
    @Transactional
    void fullUpdateCaminhaoWithPatch() throws Exception {
        // Initialize the database
        caminhaoRepository.saveAndFlush(caminhao);

        int databaseSizeBeforeUpdate = caminhaoRepository.findAll().size();

        // Update the caminhao using partial update
        Caminhao partialUpdatedCaminhao = new Caminhao();
        partialUpdatedCaminhao.setId(caminhao.getId());

        partialUpdatedCaminhao.placa(UPDATED_PLACA).ano(UPDATED_ANO).marca(UPDATED_MARCA).carga(UPDATED_CARGA);

        restCaminhaoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCaminhao.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCaminhao))
            )
            .andExpect(status().isOk());

        // Validate the Caminhao in the database
        List<Caminhao> caminhaoList = caminhaoRepository.findAll();
        assertThat(caminhaoList).hasSize(databaseSizeBeforeUpdate);
        Caminhao testCaminhao = caminhaoList.get(caminhaoList.size() - 1);
        assertThat(testCaminhao.getPlaca()).isEqualTo(UPDATED_PLACA);
        assertThat(testCaminhao.getAno()).isEqualTo(UPDATED_ANO);
        assertThat(testCaminhao.getMarca()).isEqualTo(UPDATED_MARCA);
        assertThat(testCaminhao.getCarga()).isEqualTo(UPDATED_CARGA);
    }

    @Test
    @Transactional
    void patchNonExistingCaminhao() throws Exception {
        int databaseSizeBeforeUpdate = caminhaoRepository.findAll().size();
        caminhao.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCaminhaoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, caminhao.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(caminhao))
            )
            .andExpect(status().isBadRequest());

        // Validate the Caminhao in the database
        List<Caminhao> caminhaoList = caminhaoRepository.findAll();
        assertThat(caminhaoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCaminhao() throws Exception {
        int databaseSizeBeforeUpdate = caminhaoRepository.findAll().size();
        caminhao.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCaminhaoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(caminhao))
            )
            .andExpect(status().isBadRequest());

        // Validate the Caminhao in the database
        List<Caminhao> caminhaoList = caminhaoRepository.findAll();
        assertThat(caminhaoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCaminhao() throws Exception {
        int databaseSizeBeforeUpdate = caminhaoRepository.findAll().size();
        caminhao.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCaminhaoMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(caminhao)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Caminhao in the database
        List<Caminhao> caminhaoList = caminhaoRepository.findAll();
        assertThat(caminhaoList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCaminhao() throws Exception {
        // Initialize the database
        caminhaoRepository.saveAndFlush(caminhao);

        int databaseSizeBeforeDelete = caminhaoRepository.findAll().size();

        // Delete the caminhao
        restCaminhaoMockMvc
            .perform(delete(ENTITY_API_URL_ID, caminhao.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Caminhao> caminhaoList = caminhaoRepository.findAll();
        assertThat(caminhaoList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
