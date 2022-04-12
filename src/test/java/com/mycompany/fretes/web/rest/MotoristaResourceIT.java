package com.mycompany.fretes.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.fretes.IntegrationTest;
import com.mycompany.fretes.domain.Motorista;
import com.mycompany.fretes.domain.enumeration.Sexo;
import com.mycompany.fretes.repository.MotoristaRepository;
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
 * Integration tests for the {@link MotoristaResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class MotoristaResourceIT {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    private static final String DEFAULT_TELEFONE = "AAAAAAAAAA";
    private static final String UPDATED_TELEFONE = "BBBBBBBBBB";

    private static final String DEFAULT_TELEFONE_ADICIONAL = "AAAAAAAAAA";
    private static final String UPDATED_TELEFONE_ADICIONAL = "BBBBBBBBBB";

    private static final String DEFAULT_CNH = "AAAAAAAAAA";
    private static final String UPDATED_CNH = "BBBBBBBBBB";

    private static final Sexo DEFAULT_SEXO = Sexo.M;
    private static final Sexo UPDATED_SEXO = Sexo.F;

    private static final String ENTITY_API_URL = "/api/motoristas";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private MotoristaRepository motoristaRepository;

    @Mock
    private MotoristaRepository motoristaRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMotoristaMockMvc;

    private Motorista motorista;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Motorista createEntity(EntityManager em) {
        Motorista motorista = new Motorista()
            .nome(DEFAULT_NOME)
            .telefone(DEFAULT_TELEFONE)
            .telefoneAdicional(DEFAULT_TELEFONE_ADICIONAL)
            .cnh(DEFAULT_CNH)
            .sexo(DEFAULT_SEXO);
        return motorista;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Motorista createUpdatedEntity(EntityManager em) {
        Motorista motorista = new Motorista()
            .nome(UPDATED_NOME)
            .telefone(UPDATED_TELEFONE)
            .telefoneAdicional(UPDATED_TELEFONE_ADICIONAL)
            .cnh(UPDATED_CNH)
            .sexo(UPDATED_SEXO);
        return motorista;
    }

    @BeforeEach
    public void initTest() {
        motorista = createEntity(em);
    }

    @Test
    @Transactional
    void createMotorista() throws Exception {
        int databaseSizeBeforeCreate = motoristaRepository.findAll().size();
        // Create the Motorista
        restMotoristaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(motorista)))
            .andExpect(status().isCreated());

        // Validate the Motorista in the database
        List<Motorista> motoristaList = motoristaRepository.findAll();
        assertThat(motoristaList).hasSize(databaseSizeBeforeCreate + 1);
        Motorista testMotorista = motoristaList.get(motoristaList.size() - 1);
        assertThat(testMotorista.getNome()).isEqualTo(DEFAULT_NOME);
        assertThat(testMotorista.getTelefone()).isEqualTo(DEFAULT_TELEFONE);
        assertThat(testMotorista.getTelefoneAdicional()).isEqualTo(DEFAULT_TELEFONE_ADICIONAL);
        assertThat(testMotorista.getCnh()).isEqualTo(DEFAULT_CNH);
        assertThat(testMotorista.getSexo()).isEqualTo(DEFAULT_SEXO);
    }

    @Test
    @Transactional
    void createMotoristaWithExistingId() throws Exception {
        // Create the Motorista with an existing ID
        motorista.setId(1L);

        int databaseSizeBeforeCreate = motoristaRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMotoristaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(motorista)))
            .andExpect(status().isBadRequest());

        // Validate the Motorista in the database
        List<Motorista> motoristaList = motoristaRepository.findAll();
        assertThat(motoristaList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNomeIsRequired() throws Exception {
        int databaseSizeBeforeTest = motoristaRepository.findAll().size();
        // set the field null
        motorista.setNome(null);

        // Create the Motorista, which fails.

        restMotoristaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(motorista)))
            .andExpect(status().isBadRequest());

        List<Motorista> motoristaList = motoristaRepository.findAll();
        assertThat(motoristaList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllMotoristas() throws Exception {
        // Initialize the database
        motoristaRepository.saveAndFlush(motorista);

        // Get all the motoristaList
        restMotoristaMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(motorista.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME)))
            .andExpect(jsonPath("$.[*].telefone").value(hasItem(DEFAULT_TELEFONE)))
            .andExpect(jsonPath("$.[*].telefoneAdicional").value(hasItem(DEFAULT_TELEFONE_ADICIONAL)))
            .andExpect(jsonPath("$.[*].cnh").value(hasItem(DEFAULT_CNH)))
            .andExpect(jsonPath("$.[*].sexo").value(hasItem(DEFAULT_SEXO.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllMotoristasWithEagerRelationshipsIsEnabled() throws Exception {
        when(motoristaRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restMotoristaMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(motoristaRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllMotoristasWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(motoristaRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restMotoristaMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(motoristaRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @Test
    @Transactional
    void getMotorista() throws Exception {
        // Initialize the database
        motoristaRepository.saveAndFlush(motorista);

        // Get the motorista
        restMotoristaMockMvc
            .perform(get(ENTITY_API_URL_ID, motorista.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(motorista.getId().intValue()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME))
            .andExpect(jsonPath("$.telefone").value(DEFAULT_TELEFONE))
            .andExpect(jsonPath("$.telefoneAdicional").value(DEFAULT_TELEFONE_ADICIONAL))
            .andExpect(jsonPath("$.cnh").value(DEFAULT_CNH))
            .andExpect(jsonPath("$.sexo").value(DEFAULT_SEXO.toString()));
    }

    @Test
    @Transactional
    void getNonExistingMotorista() throws Exception {
        // Get the motorista
        restMotoristaMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewMotorista() throws Exception {
        // Initialize the database
        motoristaRepository.saveAndFlush(motorista);

        int databaseSizeBeforeUpdate = motoristaRepository.findAll().size();

        // Update the motorista
        Motorista updatedMotorista = motoristaRepository.findById(motorista.getId()).get();
        // Disconnect from session so that the updates on updatedMotorista are not directly saved in db
        em.detach(updatedMotorista);
        updatedMotorista
            .nome(UPDATED_NOME)
            .telefone(UPDATED_TELEFONE)
            .telefoneAdicional(UPDATED_TELEFONE_ADICIONAL)
            .cnh(UPDATED_CNH)
            .sexo(UPDATED_SEXO);

        restMotoristaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMotorista.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedMotorista))
            )
            .andExpect(status().isOk());

        // Validate the Motorista in the database
        List<Motorista> motoristaList = motoristaRepository.findAll();
        assertThat(motoristaList).hasSize(databaseSizeBeforeUpdate);
        Motorista testMotorista = motoristaList.get(motoristaList.size() - 1);
        assertThat(testMotorista.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testMotorista.getTelefone()).isEqualTo(UPDATED_TELEFONE);
        assertThat(testMotorista.getTelefoneAdicional()).isEqualTo(UPDATED_TELEFONE_ADICIONAL);
        assertThat(testMotorista.getCnh()).isEqualTo(UPDATED_CNH);
        assertThat(testMotorista.getSexo()).isEqualTo(UPDATED_SEXO);
    }

    @Test
    @Transactional
    void putNonExistingMotorista() throws Exception {
        int databaseSizeBeforeUpdate = motoristaRepository.findAll().size();
        motorista.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMotoristaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, motorista.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(motorista))
            )
            .andExpect(status().isBadRequest());

        // Validate the Motorista in the database
        List<Motorista> motoristaList = motoristaRepository.findAll();
        assertThat(motoristaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMotorista() throws Exception {
        int databaseSizeBeforeUpdate = motoristaRepository.findAll().size();
        motorista.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMotoristaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(motorista))
            )
            .andExpect(status().isBadRequest());

        // Validate the Motorista in the database
        List<Motorista> motoristaList = motoristaRepository.findAll();
        assertThat(motoristaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMotorista() throws Exception {
        int databaseSizeBeforeUpdate = motoristaRepository.findAll().size();
        motorista.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMotoristaMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(motorista)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Motorista in the database
        List<Motorista> motoristaList = motoristaRepository.findAll();
        assertThat(motoristaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMotoristaWithPatch() throws Exception {
        // Initialize the database
        motoristaRepository.saveAndFlush(motorista);

        int databaseSizeBeforeUpdate = motoristaRepository.findAll().size();

        // Update the motorista using partial update
        Motorista partialUpdatedMotorista = new Motorista();
        partialUpdatedMotorista.setId(motorista.getId());

        partialUpdatedMotorista.nome(UPDATED_NOME).telefoneAdicional(UPDATED_TELEFONE_ADICIONAL).sexo(UPDATED_SEXO);

        restMotoristaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMotorista.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMotorista))
            )
            .andExpect(status().isOk());

        // Validate the Motorista in the database
        List<Motorista> motoristaList = motoristaRepository.findAll();
        assertThat(motoristaList).hasSize(databaseSizeBeforeUpdate);
        Motorista testMotorista = motoristaList.get(motoristaList.size() - 1);
        assertThat(testMotorista.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testMotorista.getTelefone()).isEqualTo(DEFAULT_TELEFONE);
        assertThat(testMotorista.getTelefoneAdicional()).isEqualTo(UPDATED_TELEFONE_ADICIONAL);
        assertThat(testMotorista.getCnh()).isEqualTo(DEFAULT_CNH);
        assertThat(testMotorista.getSexo()).isEqualTo(UPDATED_SEXO);
    }

    @Test
    @Transactional
    void fullUpdateMotoristaWithPatch() throws Exception {
        // Initialize the database
        motoristaRepository.saveAndFlush(motorista);

        int databaseSizeBeforeUpdate = motoristaRepository.findAll().size();

        // Update the motorista using partial update
        Motorista partialUpdatedMotorista = new Motorista();
        partialUpdatedMotorista.setId(motorista.getId());

        partialUpdatedMotorista
            .nome(UPDATED_NOME)
            .telefone(UPDATED_TELEFONE)
            .telefoneAdicional(UPDATED_TELEFONE_ADICIONAL)
            .cnh(UPDATED_CNH)
            .sexo(UPDATED_SEXO);

        restMotoristaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMotorista.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMotorista))
            )
            .andExpect(status().isOk());

        // Validate the Motorista in the database
        List<Motorista> motoristaList = motoristaRepository.findAll();
        assertThat(motoristaList).hasSize(databaseSizeBeforeUpdate);
        Motorista testMotorista = motoristaList.get(motoristaList.size() - 1);
        assertThat(testMotorista.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testMotorista.getTelefone()).isEqualTo(UPDATED_TELEFONE);
        assertThat(testMotorista.getTelefoneAdicional()).isEqualTo(UPDATED_TELEFONE_ADICIONAL);
        assertThat(testMotorista.getCnh()).isEqualTo(UPDATED_CNH);
        assertThat(testMotorista.getSexo()).isEqualTo(UPDATED_SEXO);
    }

    @Test
    @Transactional
    void patchNonExistingMotorista() throws Exception {
        int databaseSizeBeforeUpdate = motoristaRepository.findAll().size();
        motorista.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMotoristaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, motorista.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(motorista))
            )
            .andExpect(status().isBadRequest());

        // Validate the Motorista in the database
        List<Motorista> motoristaList = motoristaRepository.findAll();
        assertThat(motoristaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMotorista() throws Exception {
        int databaseSizeBeforeUpdate = motoristaRepository.findAll().size();
        motorista.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMotoristaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(motorista))
            )
            .andExpect(status().isBadRequest());

        // Validate the Motorista in the database
        List<Motorista> motoristaList = motoristaRepository.findAll();
        assertThat(motoristaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMotorista() throws Exception {
        int databaseSizeBeforeUpdate = motoristaRepository.findAll().size();
        motorista.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMotoristaMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(motorista))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Motorista in the database
        List<Motorista> motoristaList = motoristaRepository.findAll();
        assertThat(motoristaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMotorista() throws Exception {
        // Initialize the database
        motoristaRepository.saveAndFlush(motorista);

        int databaseSizeBeforeDelete = motoristaRepository.findAll().size();

        // Delete the motorista
        restMotoristaMockMvc
            .perform(delete(ENTITY_API_URL_ID, motorista.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Motorista> motoristaList = motoristaRepository.findAll();
        assertThat(motoristaList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
