package com.mycompany.fretes.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.fretes.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class FreteTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Frete.class);
        Frete frete1 = new Frete();
        frete1.setId(1L);
        Frete frete2 = new Frete();
        frete2.setId(frete1.getId());
        assertThat(frete1).isEqualTo(frete2);
        frete2.setId(2L);
        assertThat(frete1).isNotEqualTo(frete2);
        frete1.setId(null);
        assertThat(frete1).isNotEqualTo(frete2);
    }
}
