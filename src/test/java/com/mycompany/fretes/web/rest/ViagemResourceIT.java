package com.mycompany.fretes.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.fretes.IntegrationTest;
import com.mycompany.fretes.domain.Viagem;
import com.mycompany.fretes.repository.ViagemRepository;
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
 * Integration tests for the {@link ViagemResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class ViagemResourceIT {

    private static final Double DEFAULT_VALOR_DESPESA = 1D;
    private static final Double UPDATED_VALOR_DESPESA = 2D;

    private static final String ENTITY_API_URL = "/api/viagems";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ViagemRepository viagemRepository;

    @Mock
    private ViagemRepository viagemRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restViagemMockMvc;

    private Viagem viagem;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Viagem createEntity(EntityManager em) {
        Viagem viagem = new Viagem().valorDespesa(DEFAULT_VALOR_DESPESA);
        return viagem;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Viagem createUpdatedEntity(EntityManager em) {
        Viagem viagem = new Viagem().valorDespesa(UPDATED_VALOR_DESPESA);
        return viagem;
    }

    @BeforeEach
    public void initTest() {
        viagem = createEntity(em);
    }

    @Test
    @Transactional
    void createViagem() throws Exception {
        int databaseSizeBeforeCreate = viagemRepository.findAll().size();
        // Create the Viagem
        restViagemMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(viagem)))
            .andExpect(status().isCreated());

        // Validate the Viagem in the database
        List<Viagem> viagemList = viagemRepository.findAll();
        assertThat(viagemList).hasSize(databaseSizeBeforeCreate + 1);
        Viagem testViagem = viagemList.get(viagemList.size() - 1);
        assertThat(testViagem.getValorDespesa()).isEqualTo(DEFAULT_VALOR_DESPESA);
    }

    @Test
    @Transactional
    void createViagemWithExistingId() throws Exception {
        // Create the Viagem with an existing ID
        viagem.setId(1L);

        int databaseSizeBeforeCreate = viagemRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restViagemMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(viagem)))
            .andExpect(status().isBadRequest());

        // Validate the Viagem in the database
        List<Viagem> viagemList = viagemRepository.findAll();
        assertThat(viagemList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkValorDespesaIsRequired() throws Exception {
        int databaseSizeBeforeTest = viagemRepository.findAll().size();
        // set the field null
        viagem.setValorDespesa(null);

        // Create the Viagem, which fails.

        restViagemMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(viagem)))
            .andExpect(status().isBadRequest());

        List<Viagem> viagemList = viagemRepository.findAll();
        assertThat(viagemList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllViagems() throws Exception {
        // Initialize the database
        viagemRepository.saveAndFlush(viagem);

        // Get all the viagemList
        restViagemMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(viagem.getId().intValue())))
            .andExpect(jsonPath("$.[*].valorDespesa").value(hasItem(DEFAULT_VALOR_DESPESA.doubleValue())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllViagemsWithEagerRelationshipsIsEnabled() throws Exception {
        when(viagemRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restViagemMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(viagemRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllViagemsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(viagemRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restViagemMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(viagemRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    void getViagem() throws Exception {
        // Initialize the database
        viagemRepository.saveAndFlush(viagem);

        // Get the viagem
        restViagemMockMvc
            .perform(get(ENTITY_API_URL_ID, viagem.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(viagem.getId().intValue()))
            .andExpect(jsonPath("$.valorDespesa").value(DEFAULT_VALOR_DESPESA.doubleValue()));
    }

    @Test
    @Transactional
    void getNonExistingViagem() throws Exception {
        // Get the viagem
        restViagemMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewViagem() throws Exception {
        // Initialize the database
        viagemRepository.saveAndFlush(viagem);

        int databaseSizeBeforeUpdate = viagemRepository.findAll().size();

        // Update the viagem
        Viagem updatedViagem = viagemRepository.findById(viagem.getId()).get();
        // Disconnect from session so that the updates on updatedViagem are not directly saved in db
        em.detach(updatedViagem);
        updatedViagem.valorDespesa(UPDATED_VALOR_DESPESA);

        restViagemMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedViagem.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedViagem))
            )
            .andExpect(status().isOk());

        // Validate the Viagem in the database
        List<Viagem> viagemList = viagemRepository.findAll();
        assertThat(viagemList).hasSize(databaseSizeBeforeUpdate);
        Viagem testViagem = viagemList.get(viagemList.size() - 1);
        assertThat(testViagem.getValorDespesa()).isEqualTo(UPDATED_VALOR_DESPESA);
    }

    @Test
    @Transactional
    void putNonExistingViagem() throws Exception {
        int databaseSizeBeforeUpdate = viagemRepository.findAll().size();
        viagem.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restViagemMockMvc
            .perform(
                put(ENTITY_API_URL_ID, viagem.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(viagem))
            )
            .andExpect(status().isBadRequest());

        // Validate the Viagem in the database
        List<Viagem> viagemList = viagemRepository.findAll();
        assertThat(viagemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchViagem() throws Exception {
        int databaseSizeBeforeUpdate = viagemRepository.findAll().size();
        viagem.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restViagemMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(viagem))
            )
            .andExpect(status().isBadRequest());

        // Validate the Viagem in the database
        List<Viagem> viagemList = viagemRepository.findAll();
        assertThat(viagemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamViagem() throws Exception {
        int databaseSizeBeforeUpdate = viagemRepository.findAll().size();
        viagem.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restViagemMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(viagem)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Viagem in the database
        List<Viagem> viagemList = viagemRepository.findAll();
        assertThat(viagemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateViagemWithPatch() throws Exception {
        // Initialize the database
        viagemRepository.saveAndFlush(viagem);

        int databaseSizeBeforeUpdate = viagemRepository.findAll().size();

        // Update the viagem using partial update
        Viagem partialUpdatedViagem = new Viagem();
        partialUpdatedViagem.setId(viagem.getId());

        partialUpdatedViagem.valorDespesa(UPDATED_VALOR_DESPESA);

        restViagemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedViagem.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedViagem))
            )
            .andExpect(status().isOk());

        // Validate the Viagem in the database
        List<Viagem> viagemList = viagemRepository.findAll();
        assertThat(viagemList).hasSize(databaseSizeBeforeUpdate);
        Viagem testViagem = viagemList.get(viagemList.size() - 1);
        assertThat(testViagem.getValorDespesa()).isEqualTo(UPDATED_VALOR_DESPESA);
    }

    @Test
    @Transactional
    void fullUpdateViagemWithPatch() throws Exception {
        // Initialize the database
        viagemRepository.saveAndFlush(viagem);

        int databaseSizeBeforeUpdate = viagemRepository.findAll().size();

        // Update the viagem using partial update
        Viagem partialUpdatedViagem = new Viagem();
        partialUpdatedViagem.setId(viagem.getId());

        partialUpdatedViagem.valorDespesa(UPDATED_VALOR_DESPESA);

        restViagemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedViagem.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedViagem))
            )
            .andExpect(status().isOk());

        // Validate the Viagem in the database
        List<Viagem> viagemList = viagemRepository.findAll();
        assertThat(viagemList).hasSize(databaseSizeBeforeUpdate);
        Viagem testViagem = viagemList.get(viagemList.size() - 1);
        assertThat(testViagem.getValorDespesa()).isEqualTo(UPDATED_VALOR_DESPESA);
    }

    @Test
    @Transactional
    void patchNonExistingViagem() throws Exception {
        int databaseSizeBeforeUpdate = viagemRepository.findAll().size();
        viagem.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restViagemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, viagem.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(viagem))
            )
            .andExpect(status().isBadRequest());

        // Validate the Viagem in the database
        List<Viagem> viagemList = viagemRepository.findAll();
        assertThat(viagemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchViagem() throws Exception {
        int databaseSizeBeforeUpdate = viagemRepository.findAll().size();
        viagem.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restViagemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(viagem))
            )
            .andExpect(status().isBadRequest());

        // Validate the Viagem in the database
        List<Viagem> viagemList = viagemRepository.findAll();
        assertThat(viagemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamViagem() throws Exception {
        int databaseSizeBeforeUpdate = viagemRepository.findAll().size();
        viagem.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restViagemMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(viagem)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Viagem in the database
        List<Viagem> viagemList = viagemRepository.findAll();
        assertThat(viagemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteViagem() throws Exception {
        // Initialize the database
        viagemRepository.saveAndFlush(viagem);

        int databaseSizeBeforeDelete = viagemRepository.findAll().size();

        // Delete the viagem
        restViagemMockMvc
            .perform(delete(ENTITY_API_URL_ID, viagem.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Viagem> viagemList = viagemRepository.findAll();
        assertThat(viagemList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
