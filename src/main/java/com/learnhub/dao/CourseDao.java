package com.learnhub.dao;

import com.learnhub.model.Course;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class CourseDao {

    private final JdbcTemplate jdbcTemplate;

    public CourseDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private static final class CourseRowMapper implements RowMapper<Course> {
        @Override
        public Course mapRow(ResultSet rs, int rowNum) throws SQLException {
            Course course = new Course();
            course.setId(rs.getInt("id"));
            course.setTitle(rs.getString("title"));
            course.setDescription(rs.getString("description"));
            course.setDuration(rs.getInt("duration"));
            course.setInstructor(rs.getString("instructor"));
            return course;
        }
    }

    public List<Course> getAllCourses() {
        String sql = "SELECT * FROM courses";
        return jdbcTemplate.query(sql, new CourseRowMapper());
    }

    public Course getCourseById(int id) {
        String sql = "SELECT * FROM courses WHERE id = ?";
        return jdbcTemplate.queryForObject(sql, new CourseRowMapper(), id);
    }

    public void addCourse(Course course) {
        String sql = "INSERT INTO courses (title, description, duration, instructor) VALUES (?, ?, ?, ?)";
        jdbcTemplate.update(sql, course.getTitle(), course.getDescription(), course.getDuration(), course.getInstructor());
    }
}