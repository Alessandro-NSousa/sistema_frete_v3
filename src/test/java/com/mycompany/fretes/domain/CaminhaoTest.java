package com.mycompany.fretes.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.fretes.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CaminhaoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Caminhao.class);
        Caminhao caminhao1 = new Caminhao();
        caminhao1.setId(1L);
        Caminhao caminhao2 = new Caminhao();
        caminhao2.setId(caminhao1.getId());
        assertThat(caminhao1).isEqualTo(caminhao2);
        caminhao2.setId(2L);
        assertThat(caminhao1).isNotEqualTo(caminhao2);
        caminhao1.setId(null);
        assertThat(caminhao1).isNotEqualTo(caminhao2);
    }
}
