package com.mycompany.fretes.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.fretes.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class MotoristaTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Motorista.class);
        Motorista motorista1 = new Motorista();
        motorista1.setId(1L);
        Motorista motorista2 = new Motorista();
        motorista2.setId(motorista1.getId());
        assertThat(motorista1).isEqualTo(motorista2);
        motorista2.setId(2L);
        assertThat(motorista1).isNotEqualTo(motorista2);
        motorista1.setId(null);
        assertThat(motorista1).isNotEqualTo(motorista2);
    }
}
