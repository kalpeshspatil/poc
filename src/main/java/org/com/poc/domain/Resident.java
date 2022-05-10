package org.com.poc.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Resident.
 */
@Entity
@Table(name = "resident")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Resident implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(min = 3)
    @Column(name = "resident_name", nullable = false)
    private String residentName;

    @NotNull
    @Size(min = 2)
    @Column(name = "resident_address", nullable = false)
    private String residentAddress;

    @OneToMany(mappedBy = "resident")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "facilities", "resident" }, allowSetters = true)
    private Set<Room> rooms = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Resident id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getResidentName() {
        return this.residentName;
    }

    public Resident residentName(String residentName) {
        this.setResidentName(residentName);
        return this;
    }

    public void setResidentName(String residentName) {
        this.residentName = residentName;
    }

    public String getResidentAddress() {
        return this.residentAddress;
    }

    public Resident residentAddress(String residentAddress) {
        this.setResidentAddress(residentAddress);
        return this;
    }

    public void setResidentAddress(String residentAddress) {
        this.residentAddress = residentAddress;
    }

    public Set<Room> getRooms() {
        return this.rooms;
    }

    public void setRooms(Set<Room> rooms) {
        if (this.rooms != null) {
            this.rooms.forEach(i -> i.setResident(null));
        }
        if (rooms != null) {
            rooms.forEach(i -> i.setResident(this));
        }
        this.rooms = rooms;
    }

    public Resident rooms(Set<Room> rooms) {
        this.setRooms(rooms);
        return this;
    }

    public Resident addRoom(Room room) {
        this.rooms.add(room);
        room.setResident(this);
        return this;
    }

    public Resident removeRoom(Room room) {
        this.rooms.remove(room);
        room.setResident(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Resident)) {
            return false;
        }
        return id != null && id.equals(((Resident) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Resident{" +
            "id=" + getId() +
            ", residentName='" + getResidentName() + "'" +
            ", residentAddress='" + getResidentAddress() + "'" +
            "}";
    }
}
