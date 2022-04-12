package com.mycompany.fretes.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.fretes.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ViagemTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Viagem.class);
        Viagem viagem1 = new Viagem();
        viagem1.setId(1L);
        Viagem viagem2 = new Viagem();
        viagem2.setId(viagem1.getId());
        assertThat(viagem1).isEqualTo(viagem2);
        viagem2.setId(2L);
        assertThat(viagem1).isNotEqualTo(viagem2);
        viagem1.setId(null);
        assertThat(viagem1).isNotEqualTo(viagem2);
    }
}
