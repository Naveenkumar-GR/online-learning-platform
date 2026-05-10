package com.learnhub.dao;

import com.learnhub.model.Enrollment;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class EnrollmentDao {

    private final JdbcTemplate jdbcTemplate;

    public EnrollmentDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private static final class EnrollmentRowMapper implements RowMapper<Enrollment> {
        @Override
        public Enrollment mapRow(ResultSet rs, int rowNum) throws SQLException {
            Enrollment enrollment = new Enrollment();
            enrollment.setId(rs.getInt("id"));
            enrollment.setUserId(rs.getInt("user_id"));
            enrollment.setCourseId(rs.getInt("course_id"));
            enrollment.setProgress(rs.getInt("progress"));
            return enrollment;
        }
    }

    public List<Enrollment> getEnrollmentsByUserId(int userId) {
        String sql = "SELECT * FROM enrollments WHERE user_id = ?";
        return jdbcTemplate.query(sql, new EnrollmentRowMapper(), userId);
    }

    public Enrollment getEnrollment(int userId, int courseId) {
        String sql = "SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?";
        return jdbcTemplate.queryForObject(sql, new EnrollmentRowMapper(), userId, courseId);
    }

    public void enrollUser(int userId, int courseId) {
        String sql = "INSERT INTO enrollments (user_id, course_id, progress) VALUES (?, ?, 0)";
        jdbcTemplate.update(sql, userId, courseId);
    }

    public void updateProgress(int userId, int courseId, int progress) {
        String sql = "UPDATE enrollments SET progress = ? WHERE user_id = ? AND course_id = ?";
        jdbcTemplate.update(sql, progress, userId, courseId);
    }
}