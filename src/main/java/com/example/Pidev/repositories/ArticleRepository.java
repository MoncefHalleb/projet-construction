package com.example.Pidev.repositories;

import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.example.Pidev.models.Article;
@Repository
public interface ArticleRepository extends BaseRepository<Article,Long>{
    @Query("SELECT a FROM Article a WHERE " +
    "(:name IS NULL OR LOWER(a.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
    "(:minPrice IS NULL OR a.price >= :minPrice) AND " +
    "(:maxPrice IS NULL OR a.price <= :maxPrice) AND " +
    "(:type IS NULL OR LOWER(a.type) = LOWER(:type))")
List<Article> searchArticles(@Param("name") String name, 
                          @Param("minPrice") Float minPrice, 
                          @Param("maxPrice") Float maxPrice, 
                          @Param("type") String type);

    @Query("SELECT a FROM Article a ORDER BY a.salesCount DESC")
List<Article> findBestSellingArticles(Pageable pageable);

long countByStock(int stock);
}
