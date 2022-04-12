package com.mycompany.fretes.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.fretes.IntegrationTest;
import com.mycompany.fretes.domain.Despesa;
import com.mycompany.fretes.repository.DespesaRepository;
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
 * Integration tests for the {@link DespesaResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class DespesaResourceIT {

    private static final String DEFAULT_DESCRICAO = "AAAAAAAAAA";
    private static final String UPDATED_DESCRICAO = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/despesas";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private DespesaRepository despesaRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDespesaMockMvc;

    private Despesa despesa;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Despesa createEntity(EntityManager em) {
        Despesa despesa = new Despesa().descricao(DEFAULT_DESCRICAO);
        return despesa;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Despesa createUpdatedEntity(EntityManager em) {
        Despesa despesa = new Despesa().descricao(UPDATED_DESCRICAO);
        return despesa;
    }

    @BeforeEach
    public void initTest() {
        despesa = createEntity(em);
    }

    @Test
    @Transactional
    void createDespesa() throws Exception {
        int databaseSizeBeforeCreate = despesaRepository.findAll().size();
        // Create the Despesa
        restDespesaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(despesa)))
            .andExpect(status().isCreated());

        // Validate the Despesa in the database
        List<Despesa> despesaList = despesaRepository.findAll();
        assertThat(despesaList).hasSize(databaseSizeBeforeCreate + 1);
        Despesa testDespesa = despesaList.get(despesaList.size() - 1);
        assertThat(testDespesa.getDescricao()).isEqualTo(DEFAULT_DESCRICAO);
    }

    @Test
    @Transactional
    void createDespesaWithExistingId() throws Exception {
        // Create the Despesa with an existing ID
        despesa.setId(1L);

        int databaseSizeBeforeCreate = despesaRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDespesaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(despesa)))
            .andExpect(status().isBadRequest());

        // Validate the Despesa in the database
        List<Despesa> despesaList = despesaRepository.findAll();
        assertThat(despesaList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkDescricaoIsRequired() throws Exception {
        int databaseSizeBeforeTest = despesaRepository.findAll().size();
        // set the field null
        despesa.setDescricao(null);

        // Create the Despesa, which fails.

        restDespesaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(despesa)))
            .andExpect(status().isBadRequest());

        List<Despesa> despesaList = despesaRepository.findAll();
        assertThat(despesaList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllDespesas() throws Exception {
        // Initialize the database
        despesaRepository.saveAndFlush(despesa);

        // Get all the despesaList
        restDespesaMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(despesa.getId().intValue())))
            .andExpect(jsonPath("$.[*].descricao").value(hasItem(DEFAULT_DESCRICAO)));
    }

    @Test
    @Transactional
    void getDespesa() throws Exception {
        // Initialize the database
        despesaRepository.saveAndFlush(despesa);

        // Get the despesa
        restDespesaMockMvc
            .perform(get(ENTITY_API_URL_ID, despesa.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(despesa.getId().intValue()))
            .andExpect(jsonPath("$.descricao").value(DEFAULT_DESCRICAO));
    }

    @Test
    @Transactional
    void getNonExistingDespesa() throws Exception {
        // Get the despesa
        restDespesaMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewDespesa() throws Exception {
        // Initialize the database
        despesaRepository.saveAndFlush(despesa);

        int databaseSizeBeforeUpdate = despesaRepository.findAll().size();

        // Update the despesa
        Despesa updatedDespesa = despesaRepository.findById(despesa.getId()).get();
        // Disconnect from session so that the updates on updatedDespesa are not directly saved in db
        em.detach(updatedDespesa);
        updatedDespesa.descricao(UPDATED_DESCRICAO);

        restDespesaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedDespesa.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedDespesa))
            )
            .andExpect(status().isOk());

        // Validate the Despesa in the database
        List<Despesa> despesaList = despesaRepository.findAll();
        assertThat(despesaList).hasSize(databaseSizeBeforeUpdate);
        Despesa testDespesa = despesaList.get(despesaList.size() - 1);
        assertThat(testDespesa.getDescricao()).isEqualTo(UPDATED_DESCRICAO);
    }

    @Test
    @Transactional
    void putNonExistingDespesa() throws Exception {
        int databaseSizeBeforeUpdate = despesaRepository.findAll().size();
        despesa.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDespesaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, despesa.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(despesa))
            )
            .andExpect(status().isBadRequest());

        // Validate the Despesa in the database
        List<Despesa> despesaList = despesaRepository.findAll();
        assertThat(despesaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDespesa() throws Exception {
        int databaseSizeBeforeUpdate = despesaRepository.findAll().size();
        despesa.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDespesaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(despesa))
            )
            .andExpect(status().isBadRequest());

        // Validate the Despesa in the database
        List<Despesa> despesaList = despesaRepository.findAll();
        assertThat(despesaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDespesa() throws Exception {
        int databaseSizeBeforeUpdate = despesaRepository.findAll().size();
        despesa.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDespesaMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(despesa)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Despesa in the database
        List<Despesa> despesaList = despesaRepository.findAll();
        assertThat(despesaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDespesaWithPatch() throws Exception {
        // Initialize the database
        despesaRepository.saveAndFlush(despesa);

        int databaseSizeBeforeUpdate = despesaRepository.findAll().size();

        // Update the despesa using partial update
        Despesa partialUpdatedDespesa = new Despesa();
        partialUpdatedDespesa.setId(despesa.getId());

        partialUpdatedDespesa.descricao(UPDATED_DESCRICAO);

        restDespesaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDespesa.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDespesa))
            )
            .andExpect(status().isOk());

        // Validate the Despesa in the database
        List<Despesa> despesaList = despesaRepository.findAll();
        assertThat(despesaList).hasSize(databaseSizeBeforeUpdate);
        Despesa testDespesa = despesaList.get(despesaList.size() - 1);
        assertThat(testDespesa.getDescricao()).isEqualTo(UPDATED_DESCRICAO);
    }

    @Test
    @Transactional
    void fullUpdateDespesaWithPatch() throws Exception {
        // Initialize the database
        despesaRepository.saveAndFlush(despesa);

        int databaseSizeBeforeUpdate = despesaRepository.findAll().size();

        // Update the despesa using partial update
        Despesa partialUpdatedDespesa = new Despesa();
        partialUpdatedDespesa.setId(despesa.getId());

        partialUpdatedDespesa.descricao(UPDATED_DESCRICAO);

        restDespesaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDespesa.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDespesa))
            )
            .andExpect(status().isOk());

        // Validate the Despesa in the database
        List<Despesa> despesaList = despesaRepository.findAll();
        assertThat(despesaList).hasSize(databaseSizeBeforeUpdate);
        Despesa testDespesa = despesaList.get(despesaList.size() - 1);
        assertThat(testDespesa.getDescricao()).isEqualTo(UPDATED_DESCRICAO);
    }

    @Test
    @Transactional
    void patchNonExistingDespesa() throws Exception {
        int databaseSizeBeforeUpdate = despesaRepository.findAll().size();
        despesa.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDespesaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, despesa.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(despesa))
            )
            .andExpect(status().isBadRequest());

        // Validate the Despesa in the database
        List<Despesa> despesaList = despesaRepository.findAll();
        assertThat(despesaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDespesa() throws Exception {
        int databaseSizeBeforeUpdate = despesaRepository.findAll().size();
        despesa.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDespesaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(despesa))
            )
            .andExpect(status().isBadRequest());

        // Validate the Despesa in the database
        List<Despesa> despesaList = despesaRepository.findAll();
        assertThat(despesaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDespesa() throws Exception {
        int databaseSizeBeforeUpdate = despesaRepository.findAll().size();
        despesa.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDespesaMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(despesa)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Despesa in the database
        List<Despesa> despesaList = despesaRepository.findAll();
        assertThat(despesaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDespesa() throws Exception {
        // Initialize the database
        despesaRepository.saveAndFlush(despesa);

        int databaseSizeBeforeDelete = despesaRepository.findAll().size();

        // Delete the despesa
        restDespesaMockMvc
            .perform(delete(ENTITY_API_URL_ID, despesa.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Despesa> despesaList = despesaRepository.findAll();
        assertThat(despesaList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
