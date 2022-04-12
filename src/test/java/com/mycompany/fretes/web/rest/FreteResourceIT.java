package com.mycompany.fretes.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.fretes.IntegrationTest;
import com.mycompany.fretes.domain.Frete;
import com.mycompany.fretes.repository.FreteRepository;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link FreteResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class FreteResourceIT {

    private static final LocalDate DEFAULT_DATA = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DATA = LocalDate.now(ZoneId.systemDefault());

    private static final Integer DEFAULT_DIAS = 1;
    private static final Integer UPDATED_DIAS = 2;

    private static final Double DEFAULT_VALOR = 1D;
    private static final Double UPDATED_VALOR = 2D;

    private static final Integer DEFAULT_PARCELAMENTO = 1;
    private static final Integer UPDATED_PARCELAMENTO = 2;

    private static final String ENTITY_API_URL = "/api/fretes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private FreteRepository freteRepository;

    @Mock
    private FreteRepository freteRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restFreteMockMvc;

    private Frete frete;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Frete createEntity(EntityManager em) {
        Frete frete = new Frete().data(DEFAULT_DATA).dias(DEFAULT_DIAS).valor(DEFAULT_VALOR).parcelamento(DEFAULT_PARCELAMENTO);
        return frete;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Frete createUpdatedEntity(EntityManager em) {
        Frete frete = new Frete().data(UPDATED_DATA).dias(UPDATED_DIAS).valor(UPDATED_VALOR).parcelamento(UPDATED_PARCELAMENTO);
        return frete;
    }

    @BeforeEach
    public void initTest() {
        frete = createEntity(em);
    }

    @Test
    @Transactional
    void createFrete() throws Exception {
        int databaseSizeBeforeCreate = freteRepository.findAll().size();
        // Create the Frete
        restFreteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(frete)))
            .andExpect(status().isCreated());

        // Validate the Frete in the database
        List<Frete> freteList = freteRepository.findAll();
        assertThat(freteList).hasSize(databaseSizeBeforeCreate + 1);
        Frete testFrete = freteList.get(freteList.size() - 1);
        assertThat(testFrete.getData()).isEqualTo(DEFAULT_DATA);
        assertThat(testFrete.getDias()).isEqualTo(DEFAULT_DIAS);
        assertThat(testFrete.getValor()).isEqualTo(DEFAULT_VALOR);
        assertThat(testFrete.getParcelamento()).isEqualTo(DEFAULT_PARCELAMENTO);
    }

    @Test
    @Transactional
    void createFreteWithExistingId() throws Exception {
        // Create the Frete with an existing ID
        frete.setId(1L);

        int databaseSizeBeforeCreate = freteRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restFreteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(frete)))
            .andExpect(status().isBadRequest());

        // Validate the Frete in the database
        List<Frete> freteList = freteRepository.findAll();
        assertThat(freteList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllFretes() throws Exception {
        // Initialize the database
        freteRepository.saveAndFlush(frete);

        // Get all the freteList
        restFreteMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(frete.getId().intValue())))
            .andExpect(jsonPath("$.[*].data").value(hasItem(DEFAULT_DATA.toString())))
            .andExpect(jsonPath("$.[*].dias").value(hasItem(DEFAULT_DIAS)))
            .andExpect(jsonPath("$.[*].valor").value(hasItem(DEFAULT_VALOR.doubleValue())))
            .andExpect(jsonPath("$.[*].parcelamento").value(hasItem(DEFAULT_PARCELAMENTO)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllFretesWithEagerRelationshipsIsEnabled() throws Exception {
        when(freteRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restFreteMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(freteRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllFretesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(freteRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restFreteMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(freteRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    void getFrete() throws Exception {
        // Initialize the database
        freteRepository.saveAndFlush(frete);

        // Get the frete
        restFreteMockMvc
            .perform(get(ENTITY_API_URL_ID, frete.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(frete.getId().intValue()))
            .andExpect(jsonPath("$.data").value(DEFAULT_DATA.toString()))
            .andExpect(jsonPath("$.dias").value(DEFAULT_DIAS))
            .andExpect(jsonPath("$.valor").value(DEFAULT_VALOR.doubleValue()))
            .andExpect(jsonPath("$.parcelamento").value(DEFAULT_PARCELAMENTO));
    }

    @Test
    @Transactional
    void getNonExistingFrete() throws Exception {
        // Get the frete
        restFreteMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewFrete() throws Exception {
        // Initialize the database
        freteRepository.saveAndFlush(frete);

        int databaseSizeBeforeUpdate = freteRepository.findAll().size();

        // Update the frete
        Frete updatedFrete = freteRepository.findById(frete.getId()).get();
        // Disconnect from session so that the updates on updatedFrete are not directly saved in db
        em.detach(updatedFrete);
        updatedFrete.data(UPDATED_DATA).dias(UPDATED_DIAS).valor(UPDATED_VALOR).parcelamento(UPDATED_PARCELAMENTO);

        restFreteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedFrete.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedFrete))
            )
            .andExpect(status().isOk());

        // Validate the Frete in the database
        List<Frete> freteList = freteRepository.findAll();
        assertThat(freteList).hasSize(databaseSizeBeforeUpdate);
        Frete testFrete = freteList.get(freteList.size() - 1);
        assertThat(testFrete.getData()).isEqualTo(UPDATED_DATA);
        assertThat(testFrete.getDias()).isEqualTo(UPDATED_DIAS);
        assertThat(testFrete.getValor()).isEqualTo(UPDATED_VALOR);
        assertThat(testFrete.getParcelamento()).isEqualTo(UPDATED_PARCELAMENTO);
    }

    @Test
    @Transactional
    void putNonExistingFrete() throws Exception {
        int databaseSizeBeforeUpdate = freteRepository.findAll().size();
        frete.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFreteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, frete.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(frete))
            )
            .andExpect(status().isBadRequest());

        // Validate the Frete in the database
        List<Frete> freteList = freteRepository.findAll();
        assertThat(freteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchFrete() throws Exception {
        int databaseSizeBeforeUpdate = freteRepository.findAll().size();
        frete.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFreteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(frete))
            )
            .andExpect(status().isBadRequest());

        // Validate the Frete in the database
        List<Frete> freteList = freteRepository.findAll();
        assertThat(freteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamFrete() throws Exception {
        int databaseSizeBeforeUpdate = freteRepository.findAll().size();
        frete.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFreteMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(frete)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Frete in the database
        List<Frete> freteList = freteRepository.findAll();
        assertThat(freteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateFreteWithPatch() throws Exception {
        // Initialize the database
        freteRepository.saveAndFlush(frete);

        int databaseSizeBeforeUpdate = freteRepository.findAll().size();

        // Update the frete using partial update
        Frete partialUpdatedFrete = new Frete();
        partialUpdatedFrete.setId(frete.getId());

        partialUpdatedFrete.dias(UPDATED_DIAS);

        restFreteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFrete.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFrete))
            )
            .andExpect(status().isOk());

        // Validate the Frete in the database
        List<Frete> freteList = freteRepository.findAll();
        assertThat(freteList).hasSize(databaseSizeBeforeUpdate);
        Frete testFrete = freteList.get(freteList.size() - 1);
        assertThat(testFrete.getData()).isEqualTo(DEFAULT_DATA);
        assertThat(testFrete.getDias()).isEqualTo(UPDATED_DIAS);
        assertThat(testFrete.getValor()).isEqualTo(DEFAULT_VALOR);
        assertThat(testFrete.getParcelamento()).isEqualTo(DEFAULT_PARCELAMENTO);
    }

    @Test
    @Transactional
    void fullUpdateFreteWithPatch() throws Exception {
        // Initialize the database
        freteRepository.saveAndFlush(frete);

        int databaseSizeBeforeUpdate = freteRepository.findAll().size();

        // Update the frete using partial update
        Frete partialUpdatedFrete = new Frete();
        partialUpdatedFrete.setId(frete.getId());

        partialUpdatedFrete.data(UPDATED_DATA).dias(UPDATED_DIAS).valor(UPDATED_VALOR).parcelamento(UPDATED_PARCELAMENTO);

        restFreteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFrete.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFrete))
            )
            .andExpect(status().isOk());

        // Validate the Frete in the database
        List<Frete> freteList = freteRepository.findAll();
        assertThat(freteList).hasSize(databaseSizeBeforeUpdate);
        Frete testFrete = freteList.get(freteList.size() - 1);
        assertThat(testFrete.getData()).isEqualTo(UPDATED_DATA);
        assertThat(testFrete.getDias()).isEqualTo(UPDATED_DIAS);
        assertThat(testFrete.getValor()).isEqualTo(UPDATED_VALOR);
        assertThat(testFrete.getParcelamento()).isEqualTo(UPDATED_PARCELAMENTO);
    }

    @Test
    @Transactional
    void patchNonExistingFrete() throws Exception {
        int databaseSizeBeforeUpdate = freteRepository.findAll().size();
        frete.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFreteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, frete.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(frete))
            )
            .andExpect(status().isBadRequest());

        // Validate the Frete in the database
        List<Frete> freteList = freteRepository.findAll();
        assertThat(freteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchFrete() throws Exception {
        int databaseSizeBeforeUpdate = freteRepository.findAll().size();
        frete.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFreteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(frete))
            )
            .andExpect(status().isBadRequest());

        // Validate the Frete in the database
        List<Frete> freteList = freteRepository.findAll();
        assertThat(freteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamFrete() throws Exception {
        int databaseSizeBeforeUpdate = freteRepository.findAll().size();
        frete.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFreteMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(frete)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Frete in the database
        List<Frete> freteList = freteRepository.findAll();
        assertThat(freteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteFrete() throws Exception {
        // Initialize the database
        freteRepository.saveAndFlush(frete);

        int databaseSizeBeforeDelete = freteRepository.findAll().size();

        // Delete the frete
        restFreteMockMvc
            .perform(delete(ENTITY_API_URL_ID, frete.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Frete> freteList = freteRepository.findAll();
        assertThat(freteList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
