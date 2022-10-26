<?php

namespace App\Controller;

use App\Repository\ProductRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Paginator;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[AsController]
class ApiController extends AbstractController
{
    public function __invoke(Request $request, ProductRepository $bookRepository): Paginator
    {
        $page = (int) $request->query->get('page', 1);

        return $bookRepository->getBooksByFavoriteAuthor($page);
    }
}
