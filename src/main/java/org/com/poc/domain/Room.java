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
 * A Room.
 */
@Entity
@Table(name = "room")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Room implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "room_title", nullable = false)
    private String roomTitle;

    @Lob
    @Column(name = "room_description", nullable = false)
    private String roomDescription;

    @NotNull
    @Column(name = "room_type", nullable = false)
    private String roomType;

    @OneToMany(mappedBy = "room")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "room" }, allowSetters = true)
    private Set<Facility> facilities = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "rooms" }, allowSetters = true)
    private Resident resident;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Room id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRoomTitle() {
        return this.roomTitle;
    }

    public Room roomTitle(String roomTitle) {
        this.setRoomTitle(roomTitle);
        return this;
    }

    public void setRoomTitle(String roomTitle) {
        this.roomTitle = roomTitle;
    }

    public String getRoomDescription() {
        return this.roomDescription;
    }

    public Room roomDescription(String roomDescription) {
        this.setRoomDescription(roomDescription);
        return this;
    }

    public void setRoomDescription(String roomDescription) {
        this.roomDescription = roomDescription;
    }

    public String getRoomType() {
        return this.roomType;
    }

    public Room roomType(String roomType) {
        this.setRoomType(roomType);
        return this;
    }

    public void setRoomType(String roomType) {
        this.roomType = roomType;
    }

    public Set<Facility> getFacilities() {
        return this.facilities;
    }

    public void setFacilities(Set<Facility> facilities) {
        if (this.facilities != null) {
            this.facilities.forEach(i -> i.setRoom(null));
        }
        if (facilities != null) {
            facilities.forEach(i -> i.setRoom(this));
        }
        this.facilities = facilities;
    }

    public Room facilities(Set<Facility> facilities) {
        this.setFacilities(facilities);
        return this;
    }

    public Room addFacility(Facility facility) {
        this.facilities.add(facility);
        facility.setRoom(this);
        return this;
    }

    public Room removeFacility(Facility facility) {
        this.facilities.remove(facility);
        facility.setRoom(null);
        return this;
    }

    public Resident getResident() {
        return this.resident;
    }

    public void setResident(Resident resident) {
        this.resident = resident;
    }

    public Room resident(Resident resident) {
        this.setResident(resident);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Room)) {
            return false;
        }
        return id != null && id.equals(((Room) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Room{" +
            "id=" + getId() +
            ", roomTitle='" + getRoomTitle() + "'" +
            ", roomDescription='" + getRoomDescription() + "'" +
            ", roomType='" + getRoomType() + "'" +
            "}";
    }
}
