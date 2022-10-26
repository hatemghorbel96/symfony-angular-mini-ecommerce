<?php

namespace App\Repository;

use App\Entity\Product;
use Doctrine\Persistence\ManagerRegistry;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Paginator;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Doctrine\Common\Collections\Criteria;
use Doctrine\ORM\Tools\Pagination\Paginator as DoctrinePaginator;

/**
 * @extends ServiceEntityRepository<Product>
 *
 * @method Product|null find($id, $lockMode = null, $lockVersion = null)
 * @method Product|null findOneBy(array $criteria, array $orderBy = null)
 * @method Product[]    findAll()
 * @method Product[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ProductRepository extends ServiceEntityRepository
{
    const ITEMS_PER_PAGE = 20;
    private $tokenStorage;

    public function __construct(ManagerRegistry $registry, TokenStorageInterface $tokenStorage)
    {
        parent::__construct($registry, Product::class);
        $this->tokenStorage = $tokenStorage;
    }

    public function add(Product $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Product $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function getBooksByFavoriteAuthor(int $page = 1): Paginator
    {
        $firstResult = ($page -1) * self::ITEMS_PER_PAGE;

        $user = $this->tokenStorage->getToken()->getUser();
        $queryBuilder = $this->createQueryBuilder('b');
        $queryBuilder->select('b')
            ->from(Book::class, 'b');
           

        $query = $queryBuilder->getQuery()
            ->setFirstResult($firstResult)
            ->setMaxResults(self::ITEMS_PER_PAGE);

        $doctrinePaginator = new DoctrinePaginator($query);
        $paginator = new Paginator($doctrinePaginator);

        return $paginator;
    }

//    /**
//     * @return Product[] Returns an array of Product objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('p')
//            ->andWhere('p.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('p.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Product
//    {
//        return $this->createQueryBuilder('p')
//            ->andWhere('p.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
